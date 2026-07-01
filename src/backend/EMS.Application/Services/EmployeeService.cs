using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using EMS.Application.DTOs;
using EMS.Application.Interfaces;
using EMS.Application.Interfaces.Services;
using EMS.Domain.Entities;

namespace EMS.Application.Services
{
    public class EmployeeService : IEmployeeService
    {
        private readonly IGenericRepository<Employee> _employeeRepository;
        private readonly IGenericRepository<Department> _departmentRepository;
        private readonly IGenericRepository<Designation> _designationRepository;
        private readonly IMapper _mapper;

        public EmployeeService(
            IGenericRepository<Employee> employeeRepository,
            IGenericRepository<Department> departmentRepository,
            IGenericRepository<Designation> designationRepository,
            IMapper mapper)
        {
            _employeeRepository = employeeRepository;
            _departmentRepository = departmentRepository;
            _designationRepository = designationRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<EmployeeDto>> GetAllAsync()
        {
            var employees = await _employeeRepository.GetAllAsync();
            var employeeDtos = _mapper.Map<IEnumerable<EmployeeDto>>(employees);

            foreach (var dto in employeeDtos)
            {
                var dept = await _departmentRepository.GetByIdAsync(dto.DepartmentId);
                dto.DepartmentName = dept?.Name ?? "Unknown";

                var desig = await _designationRepository.GetByIdAsync(dto.DesignationId);
                dto.DesignationName = desig?.Name ?? "Unknown";
            }

            return employeeDtos;
        }

        public async Task<EmployeeDto?> GetByIdAsync(Guid id)
        {
            var employee = await _employeeRepository.GetByIdAsync(id);
            if (employee == null) return null;

            var dto = _mapper.Map<EmployeeDto>(employee);
            var dept = await _departmentRepository.GetByIdAsync(dto.DepartmentId);
            dto.DepartmentName = dept?.Name ?? "Unknown";

            var desig = await _designationRepository.GetByIdAsync(dto.DesignationId);
            dto.DesignationName = desig?.Name ?? "Unknown";

            return dto;
        }

        public async Task<EmployeeDto?> GetByUserIdAsync(Guid userId)
        {
            var employees = await _employeeRepository.FindAsync(e => e.ApplicationUserId == userId);
            var employee = employees.FirstOrDefault();
            if (employee == null) return null;

            return await GetByIdAsync(employee.Id);
        }

        public async Task<EmployeeDto> CreateAsync(CreateEmployeeDto dto)
        {
            var employee = _mapper.Map<Employee>(dto);
            employee.Id = Guid.NewGuid();
            await _employeeRepository.AddAsync(employee);
            await _employeeRepository.SaveChangesAsync();

            return await GetByIdAsync(employee.Id);
        }

        public async Task<bool> UpdateAsync(Guid id, UpdateEmployeeDto dto)
        {
            var employee = await _employeeRepository.GetByIdAsync(id);
            if (employee == null) return false;

            _mapper.Map(dto, employee);
            employee.UpdatedDate = DateTime.UtcNow;
            _employeeRepository.Update(employee);
            await _employeeRepository.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var employee = await _employeeRepository.GetByIdAsync(id);
            if (employee == null) return false;

            _employeeRepository.Delete(employee);
            await _employeeRepository.SaveChangesAsync();
            return true;
        }
    }
}
