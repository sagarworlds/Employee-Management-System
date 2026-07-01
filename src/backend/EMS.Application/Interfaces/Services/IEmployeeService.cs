using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using EMS.Application.DTOs;

namespace EMS.Application.Interfaces.Services
{
    public interface IEmployeeService
    {
        Task<IEnumerable<EmployeeDto>> GetAllAsync();
        Task<EmployeeDto?> GetByIdAsync(Guid id);
        Task<EmployeeDto?> GetByUserIdAsync(Guid userId);
        Task<EmployeeDto> CreateAsync(CreateEmployeeDto dto);
        Task<bool> UpdateAsync(Guid id, UpdateEmployeeDto dto);
        Task<bool> DeleteAsync(Guid id);
    }
}
