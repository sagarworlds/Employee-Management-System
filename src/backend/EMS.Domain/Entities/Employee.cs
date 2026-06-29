using System;

namespace EMS.Domain.Entities
{
    public class Employee
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
        public string Status { get; set; } = "Active"; // Active, Inactive, Terminated
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedDate { get; set; }
        public bool IsActive { get; set; } = true;

        public virtual Department Department { get; set; } = null!;
        public virtual Designation Designation { get; set; } = null!;
    }
}
