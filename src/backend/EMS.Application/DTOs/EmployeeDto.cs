using System;

namespace EMS.Application.DTOs
{
    public class EmployeeDto
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
        public string Gender { get; set; } = string.Empty;
        public DateTime DateOfJoining { get; set; }
        public Guid DepartmentId { get; set; }
        public Guid DesignationId { get; set; }
        public decimal Salary { get; set; }
        public string? Address { get; set; }
        public string Status { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public string DepartmentName { get; set; } = string.Empty;
        public string DesignationName { get; set; } = string.Empty;
    }

    public class CreateEmployeeDto
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
        public string Gender { get; set; } = string.Empty;
        public DateTime DateOfJoining { get; set; }
        public Guid DepartmentId { get; set; }
        public Guid DesignationId { get; set; }
        public decimal Salary { get; set; }
        public string? Address { get; set; }
        public Guid? ApplicationUserId { get; set; }
    }

    public class UpdateEmployeeDto
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
        public string Gender { get; set; } = string.Empty;
        public DateTime DateOfJoining { get; set; }
        public Guid DepartmentId { get; set; }
        public Guid DesignationId { get; set; }
        public decimal Salary { get; set; }
        public string? Address { get; set; }
        public string Status { get; set; } = string.Empty;
        public bool IsActive { get; set; }
    }
}
