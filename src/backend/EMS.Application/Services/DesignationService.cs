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
    public class DesignationService : IDesignationService
    {
        private readonly IGenericRepository<Designation> _repository;
        private readonly IMapper _mapper;

        public DesignationService(IGenericRepository<Designation> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<DesignationDto>> GetAllAsync()
        {
            var designations = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<DesignationDto>>(designations);
        }

        public async Task<DesignationDto?> GetByIdAsync(Guid id)
        {
            var designation = await _repository.GetByIdAsync(id);
            return _mapper.Map<DesignationDto>(designation);
        }

        public async Task<DesignationDto> CreateAsync(CreateDesignationDto dto)
        {
            var designation = _mapper.Map<Designation>(dto);
            designation.Id = Guid.NewGuid();
            await _repository.AddAsync(designation);
            await _repository.SaveChangesAsync();
            return _mapper.Map<DesignationDto>(designation);
        }

        public async Task<bool> UpdateAsync(Guid id, UpdateDesignationDto dto)
        {
            var designation = await _repository.GetByIdAsync(id);
            if (designation == null) return false;

            _mapper.Map(dto, designation);
            designation.UpdatedDate = DateTime.UtcNow;
            _repository.Update(designation);
            await _repository.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var designation = await _repository.GetByIdAsync(id);
            if (designation == null) return false;

            _repository.Delete(designation);
            await _repository.SaveChangesAsync();
            return true;
        }
    }
}
