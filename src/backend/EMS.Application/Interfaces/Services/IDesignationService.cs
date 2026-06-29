using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using EMS.Application.DTOs;

namespace EMS.Application.Interfaces.Services
{
    public interface IDesignationService
    {
        Task<IEnumerable<DesignationDto>> GetAllAsync();
        Task<DesignationDto?> GetByIdAsync(Guid id);
        Task<DesignationDto> CreateAsync(CreateDesignationDto dto);
        Task<bool> UpdateAsync(Guid id, UpdateDesignationDto dto);
        Task<bool> DeleteAsync(Guid id);
    }
}
