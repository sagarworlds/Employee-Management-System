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
    public class LeaveService : ILeaveService
    {
        private readonly IGenericRepository<LeaveRequest> _repository;
        private readonly IMapper _mapper;

        public LeaveService(IGenericRepository<LeaveRequest> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<LeaveRequestDto>> GetByEmployeeIdAsync(Guid employeeId)
        {
            var leaves = await _repository.GetAllAsync();
            var filtered = leaves.Where(l => l.EmployeeId == employeeId);
            return _mapper.Map<IEnumerable<LeaveRequestDto>>(filtered);
        }

        public async Task<LeaveRequestDto> ApplyLeaveAsync(CreateLeaveRequestDto dto)
        {
            var leave = _mapper.Map<LeaveRequest>(dto);
            leave.Id = Guid.NewGuid();
            leave.Status = "Pending";
            await _repository.AddAsync(leave);
            await _repository.SaveChangesAsync();
            return _mapper.Map<LeaveRequestDto>(leave);
        }

        public async Task<bool> UpdateLeaveStatusAsync(Guid id, string status, Guid approvedByUserId)
        {
            var leave = await _repository.GetByIdAsync(id);
            if (leave == null) return false;

            leave.Status = status;
            leave.ApprovedByUserId = approvedByUserId;
            leave.ApprovalDate = DateTime.UtcNow;
            leave.UpdatedDate = DateTime.UtcNow;
            _repository.Update(leave);
            await _repository.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteLeaveRequestAsync(Guid id)
        {
            var leave = await _repository.GetByIdAsync(id);
            if (leave == null) return false;

            _repository.Delete(leave);
            await _repository.SaveChangesAsync();
            return true;
        }
    }
}
