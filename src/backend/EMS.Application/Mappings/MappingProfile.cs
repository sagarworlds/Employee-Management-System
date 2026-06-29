using AutoMapper;
using EMS.Domain.Entities;
using EMS.Application.DTOs;

namespace EMS.Application.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Department
            CreateMap<Department, DepartmentDto>();
            CreateMap<CreateDepartmentDto, Department>();
            CreateMap<UpdateDepartmentDto, Department>();

            // Designation
            CreateMap<Designation, DesignationDto>();
            CreateMap<CreateDesignationDto, Designation>();
            CreateMap<UpdateDesignationDto, Designation>();

            // Employee
            CreateMap<Employee, EmployeeDto>()
                .ForMember(dest => dest.DepartmentName, opt => opt.MapFrom(src => src.Department.Name))
                .ForMember(dest => dest.DesignationName, opt => opt.MapFrom(src => src.Designation.Name));
            CreateMap<CreateEmployeeDto, Employee>();
            CreateMap<UpdateEmployeeDto, Employee>();

            // Attendance
            CreateMap<Attendance, AttendanceDto>();
            CreateMap<CreateAttendanceDto, Attendance>();
            CreateMap<UpdateAttendanceDto, Attendance>();

            // Leave Request
            CreateMap<LeaveRequest, LeaveRequestDto>();
            CreateMap<CreateLeaveRequestDto, LeaveRequest>();

        }
    }
}
