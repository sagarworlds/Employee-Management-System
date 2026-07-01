using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using EMS.Application.Interfaces.Services;
using EMS.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Security.Claims;
using System.Linq;

namespace EMS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class EmployeeController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;

        public EmployeeController(IEmployeeService employeeService)
        {
            _employeeService = employeeService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll()
        {
            var employees = await _employeeService.GetAllAsync();
            return Ok(employees);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var employee = await _employeeService.GetByIdAsync(id);
            if (employee == null) return NotFound("Employee not found");
            return Ok(employee);
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetMe()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            {
                return BadRequest("Invalid user identity");
            }

            var employee = await _employeeService.GetByUserIdAsync(userId);
            if (employee == null) return NotFound("Employee profile not found for this user");

            return Ok(employee);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] CreateEmployeeDto dto)
        {
            var employee = await _employeeService.CreateAsync(dto);
            return Ok(employee);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateEmployeeDto dto)
        {
            var result = await _employeeService.UpdateAsync(id, dto);
            if (!result) return NotFound("Employee not found");
            return Ok("Employee updated successfully");
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await _employeeService.DeleteAsync(id);
            if (!result) return NotFound("Employee not found");
            return Ok("Employee deleted successfully");
        }
    }
}
