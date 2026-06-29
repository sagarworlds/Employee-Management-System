using Microsoft.AspNetCore.Mvc;
using EMS.Application.DTOs;
using EMS.Application.Interfaces.Services;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EMS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AttendanceController : ControllerBase
    {
        private readonly IAttendanceService _attendanceService;

        public AttendanceController(IAttendanceService attendanceService)
        {
            _attendanceService = attendanceService;
        }

        [HttpGet("employee/{employeeId}")]
        public async Task<ActionResult<IEnumerable<AttendanceDto>>> GetByEmployee(Guid employeeId)
        {
            var attendance = await _attendanceService.GetByEmployeeIdAsync(employeeId);
            return Ok(attendance);
        }

        [HttpPost]
        public async Task<ActionResult<AttendanceDto>> Record(CreateAttendanceDto dto)
        {
            var result = await _attendanceService.RecordAttendanceAsync(dto);
            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, UpdateAttendanceDto dto)
        {
            var result = await _attendanceService.UpdateAttendanceAsync(id, dto);
            if (!result) return NotFound();
            return NoContent();
        }
    }
}
