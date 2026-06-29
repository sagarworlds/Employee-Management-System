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
    public class DepartmentService : IDepartmentService
    {
        private readonly IGenericRepository<Department> _repository;
        private readonly IMapper _mapper;

        public DepartmentService(IGenericRepository<Department> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<DepartmentDto>> GetAllAsync()
        {
            var departments = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<DepartmentDto>>(departments);
        }

        public async Task<DepartmentDto?> GetByIdAsync(Guid id)
        {
            var department = await _repository.GetByIdAsync(id);
            return _mapper.Map<DepartmentDto>(department);
        }

        public async Task<DepartmentDto> CreateAsync(CreateDepartmentDto dto)
        {
            var department = _mapper.Map<Department>(dto);
            department.Id = Guid.NewGuid();
            await _repository.AddAsync(department);
            await _repository.SaveChangesAsync();
            return _mapper.Map<DepartmentDto>(department);
        }

        public async Task<bool> UpdateAsync(Guid id, UpdateDepartmentDto dto)
        {
            var department = await _repository.GetByIdAsync(id);
            if (department == null) return false;

            _mapper.Map(dto, department);
            department.UpdatedDate = DateTime.UtcNow;
            _repository.Update(department);
            await _repository.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var department = await _repository.GetByIdAsync(id);
            if (department == null) return false;

            _repository.Delete(department);
            await _repository.SaveChangesAsync();
            return true;
        }
    }
}
