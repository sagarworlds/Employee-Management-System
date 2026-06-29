using System;
using System.Collections.Generic;

namespace EMS.Domain.Entities
{
    public class ApplicationRole
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public virtual ICollection<ApplicationUser> Users { get; set; } = new List<ApplicationUser>();
    }
}
