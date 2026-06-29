using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using EMS.Application.DTOs;

namespace EMS.Application.Interfaces.Services
{
    public interface ILeaveService
    {
        Task<IEnumerable<LeaveRequestDto>> GetByEmployeeIdAsync(Guid employeeId);
        Task<LeaveRequestDto> ApplyLeaveAsync(CreateLeaveRequestDto dto);
        Task<bool> UpdateLeaveStatusAsync(Guid id, string status, Guid approvedByUserId);
        Task<bool> DeleteLeaveRequestAsync(Guid id);
    }
}
