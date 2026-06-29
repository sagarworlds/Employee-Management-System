using System;
using System.Collections.Generic;

namespace EMS.Domain.Entities
{
    public class Designation
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedDate { get; set; }
        public bool IsActive { get; set; } = true;

        public virtual ICollection<Employee> Employees { get; set; } = new List<Employee>();
    }
}
