using System;

namespace EMS.Application.DTOs
{
    public class AttendanceDto
    {
        public Guid Id { get; set; }
        public Guid EmployeeId { get; set; }
        public DateTime Date { get; set; }
        public DateTime CheckInTime { get; set; }
        public DateTime? CheckOutTime { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? Remarks { get; set; }
    }

    public class CreateAttendanceDto
    {
        public Guid EmployeeId { get; set; }
        public DateTime Date { get; set; }
        public DateTime CheckInTime { get; set; }
        public string Status { get; set; } = "Present";
        public string? Remarks { get; set; }
    }

    public class UpdateAttendanceDto
    {
        public DateTime? CheckOutTime { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? Remarks { get; set; }
    }
}
