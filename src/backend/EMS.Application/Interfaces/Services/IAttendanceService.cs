using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using EMS.Application.DTOs;

namespace EMS.Application.Interfaces.Services
{
    public interface IAttendanceService
    {
        Task<IEnumerable<AttendanceDto>> GetByEmployeeIdAsync(Guid employeeId);
        Task<AttendanceDto> RecordAttendanceAsync(CreateAttendanceDto dto);
        Task<bool> UpdateAttendanceAsync(Guid id, UpdateAttendanceDto dto);
    }
}
