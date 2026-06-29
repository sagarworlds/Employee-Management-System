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
    public class DesignationsController : ControllerBase
    {
        private readonly IDesignationService _designationService;

        public DesignationsController(IDesignationService designationService)
        {
            _designationService = designationService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<DesignationDto>>> GetAll()
        {
            var designations = await _designationService.GetAllAsync();
            return Ok(designations);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<DesignationDto>> GetById(Guid id)
        {
            var designation = await _designationService.GetByIdAsync(id);
            if (designation == null) return NotFound();
            return Ok(designation);
        }

        [HttpPost]
        public async Task<ActionResult<DesignationDto>> Create(CreateDesignationDto dto)
        {
            var designation = await _designationService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = designation.Id }, designation);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, UpdateDesignationDto dto)
        {
            var result = await _designationService.UpdateAsync(id, dto);
            if (!result) return NotFound();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await _designationService.DeleteAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }
    }
}
