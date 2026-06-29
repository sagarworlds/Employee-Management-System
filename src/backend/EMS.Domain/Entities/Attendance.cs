using System;

namespace EMS.Domain.Entities
{
    public class Attendance
    {
        public Guid Id { get; set; }
        public Guid EmployeeId { get; set; }
        public DateTime Date { get; set; }
        public DateTime CheckInTime { get; set; }
        public DateTime? CheckOutTime { get; set; }
        public string Status { get; set; } = "Present"; // Present, Absent, Late, HalfDay
        public string? Remarks { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        public virtual Employee Employee { get; set; } = null!;
    }
}
