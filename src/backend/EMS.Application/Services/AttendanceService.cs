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
    public class AttendanceService : IAttendanceService
    {
        private readonly IGenericRepository<Attendance> _repository;
        private readonly IMapper _mapper;

        public AttendanceService(IGenericRepository<Attendance> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<AttendanceDto>> GetByEmployeeIdAsync(Guid employeeId)
        {
            var attendances = await _repository.GetAllAsync();
            var filtered = attendances.Where(a => a.EmployeeId == employeeId);
            return _mapper.Map<IEnumerable<AttendanceDto>>(filtered);
        }

        public async Task<AttendanceDto> RecordAttendanceAsync(CreateAttendanceDto dto)
        {
            var attendance = _mapper.Map<Attendance>(dto);
            attendance.Id = Guid.NewGuid();
            await _repository.AddAsync(attendance);
            await _repository.SaveChangesAsync();
            return _mapper.Map<AttendanceDto>(attendance);
        }

        public async Task<bool> UpdateAttendanceAsync(Guid id, UpdateAttendanceDto dto)
        {
            var attendance = await _repository.GetByIdAsync(id);
            if (attendance == null) return false;

            _mapper.Map(dto, attendance);
            _repository.Update(attendance);
            await _repository.SaveChangesAsync();
            return true;
        }
    }
}
