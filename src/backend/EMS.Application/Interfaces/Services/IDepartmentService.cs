using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using EMS.Application.DTOs;

namespace EMS.Application.Interfaces.Services
{
    public interface IDepartmentService
    {
        Task<IEnumerable<DepartmentDto>> GetAllAsync();
        Task<DepartmentDto?> GetByIdAsync(Guid id);
        Task<DepartmentDto> CreateAsync(CreateDepartmentDto dto);
        Task<bool> UpdateAsync(Guid id, UpdateDepartmentDto dto);
        Task<bool> DeleteAsync(Guid id);
    }
}
