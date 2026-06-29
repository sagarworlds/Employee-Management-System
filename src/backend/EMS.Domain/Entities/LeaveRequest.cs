using System;

namespace EMS.Domain.Entities
{
    public class LeaveRequest
    {
        public Guid Id { get; set; }
        public Guid EmployeeId { get; set; }
        public string LeaveType { get; set; } = string.Empty; // Sick, Casual, Earned, etc.
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal TotalDays { get; set; }
        public string Reason { get; set; } = string.Empty;
        public string Status { get; set; } = "Pending"; // Pending, Approved, Rejected
        public Guid? ApprovedByUserId { get; set; }
        public DateTime? ApprovalDate { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedDate { get; set; }

        public virtual Employee Employee { get; set; } = null!;
    }
}
