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
    public class LeaveRequestsController : ControllerBase
    {
        private readonly ILeaveService _leaveService;

        public LeaveRequestsController(ILeaveService leaveService)
        {
            _leaveService = leaveService;
        }

        [HttpGet("employee/{employeeId}")]
        public async Task<ActionResult<IEnumerable<LeaveRequestDto>>> GetByEmployee(Guid employeeId)
        {
            var leaves = await _leaveService.GetByEmployeeIdAsync(employeeId);
            return Ok(leaves);
        }

        [HttpPost]
        public async Task<ActionResult<LeaveRequestDto>> Apply(CreateLeaveRequestDto dto)
        {
            var result = await _leaveService.ApplyLeaveAsync(dto);
            return Ok(result);
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateLeaveStatusDto dto)
        {
            var result = await _leaveService.UpdateLeaveStatusAsync(id, dto.Status, dto.ApprovedByUserId);
            if (!result) return NotFound();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await _leaveService.DeleteLeaveRequestAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }
    }

    public class UpdateLeaveStatusDto
    {
        public string Status { get; set; } = string.Empty;
        public Guid ApprovedByUserId { get; set; }
    }
}
