using Microsoft.AspNetCore.Mvc;
using EMS.Application.Interfaces;
using EMS.Domain.Entities;
using System;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace EMS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IGenericRepository<ApplicationUser> _userRepository;
        private readonly IGenericRepository<ApplicationRole> _roleRepository;
        private readonly IGenericRepository<Employee> _employeeRepository;
        private readonly ITokenService _tokenService;

        public AuthController(
            IGenericRepository<ApplicationUser> userRepository,
            IGenericRepository<ApplicationRole> roleRepository,
            IGenericRepository<Employee> employeeRepository,
            ITokenService tokenService)
        {
            _userRepository = userRepository;
            _roleRepository = roleRepository;
            _employeeRepository = employeeRepository;
            _tokenService = tokenService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var user = (await _userRepository.GetAllAsync()).FirstOrDefault(u => u.UserName == loginDto.Username && u.PasswordHash == loginDto.Password);
            if (user == null) return Unauthorized("Invalid username or password");

            var role = await _roleRepository.GetByIdAsync(user.RoleId ?? Guid.Empty);
            if (role == null) return Unauthorized("User has no assigned role");

            var token = _tokenService.GenerateToken(user, role);
            return Ok(new { Token = token, UserName = user.UserName, Role = role.Name });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            var user = new ApplicationUser
            {
                Id = Guid.NewGuid(),
                UserName = registerDto.Username,
                Email = registerDto.Email,
                PasswordHash = registerDto.Password, // In real app, use PasswordHasher
                FullName = registerDto.FullName,
                RoleId = registerDto.RoleId,
                IsActive = true
            };

            await _userRepository.AddAsync(user);
            await _userRepository.SaveChangesAsync();

            // Auto-link existing Employee record if email matches
            var employees = await _employeeRepository.GetAllAsync();
            var employee = employees.FirstOrDefault(e => e.Email.Equals(registerDto.Email, StringComparison.OrdinalIgnoreCase));
            if (employee != null)
            {
                employee.ApplicationUserId = user.Id;
                _employeeRepository.Update(employee);
                await _employeeRepository.SaveChangesAsync();
            }

            return Ok("User registered successfully");
        }
    }

    public class LoginDto
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class RegisterDto
    {
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public Guid RoleId { get; set; }
    }
}
