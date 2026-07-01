using Microsoft.EntityFrameworkCore;
using EMS.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace EMS.Infrastructure.Persistence
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Employee> Employees { get; set; } = null!;
        public DbSet<Department> Departments { get; set; } = null!;
        public DbSet<Designation> Designations { get; set; } = null!;
        public DbSet<Attendance> Attendances { get; set; } = null!;
        public DbSet<LeaveRequest> LeaveRequests { get; set; } = null!;
        public DbSet<ApplicationUser> Users { get; set; } = null!;
        public DbSet<ApplicationRole> Roles { get; set; } = null!;
        public DbSet<AuditLog> AuditLogs { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Department
            modelBuilder.Entity<Department>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            });

            // Designation
            modelBuilder.Entity<Designation>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            });

            // Employee
            modelBuilder.Entity<Employee>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.FirstName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.LastName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
                entity.Property(e => e.Phone).HasMaxLength(20);
                entity.Property(e => e.Status).HasMaxLength(50);

                entity.HasOne(e => e.Department)
                      .WithMany(d => d.Employees)
                      .HasForeignKey(e => e.DepartmentId);

                entity.HasOne(e => e.Designation)
                      .WithMany(d => d.Employees)
                      .HasForeignKey(e => e.DesignationId);
            });

            // Attendance
            modelBuilder.Entity<Attendance>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Status).HasMaxLength(50);
            });

            // LeaveRequest
            modelBuilder.Entity<LeaveRequest>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Status).HasMaxLength(50);
                entity.Property(e => e.LeaveType).HasMaxLength(100);
            });

            // ApplicationRole
            modelBuilder.Entity<ApplicationRole>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            });

            modelBuilder.Entity<ApplicationRole>().HasData(
                new ApplicationRole { Id = Guid.Parse("00000000-0000-0000-0000-000000000001"), Name = "Admin" },
                new ApplicationRole { Id = Guid.Parse("00000000-0000-0000-0000-000000000002"), Name = "Employee" }
            );

            // ApplicationUser
            modelBuilder.Entity<ApplicationUser>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.UserName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(255);

                entity.HasOne(u => u.Role)
                      .WithMany(r => r.Users)
                      .HasForeignKey(u => u.RoleId);
            });

            modelBuilder.Entity<ApplicationUser>().HasData(
                new ApplicationUser
                {
                    Id = Guid.Parse("00000000-0000-0000-0000-000000000003"),
                    UserName = "admin",
                    Email = "admin@ems.com",
                    PasswordHash = "Admin123!",
                    FullName = "System Administrator",
                    RoleId = Guid.Parse("00000000-0000-0000-0000-000000000001"),
                    IsActive = true,
                    CreatedDate = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new ApplicationUser
                {
                    Id = Guid.Parse("00000000-0000-0000-0000-000000000004"),
                    UserName = "user1",
                    Email = "user1@ems.com",
                    PasswordHash = "User123!",
                    FullName = "John Doe",
                    RoleId = Guid.Parse("00000000-0000-0000-0000-000000000002"),
                    IsActive = true,
                    CreatedDate = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new ApplicationUser
                {
                    Id = Guid.Parse("00000000-0000-0000-0000-000000000005"),
                    UserName = "user2",
                    Email = "user2@ems.com",
                    PasswordHash = "User123!",
                    FullName = "Jane Smith",
                    RoleId = Guid.Parse("00000000-0000-0000-0000-000000000002"),
                    IsActive = true,
                    CreatedDate = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                }
            );

            // AuditLog
            modelBuilder.Entity<AuditLog>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Action).IsRequired().HasMaxLength(100);
                entity.Property(e => e.TableName).IsRequired().HasMaxLength(100);
            });
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            var entries = ChangeTracker.Entries()
                .Where(e => e.Entity is not AuditLog && (e.State == EntityState.Added || e.State == EntityState.Modified || e.State == EntityState.Deleted))
                .ToList();

            foreach (var entry in entries)
            {
                var auditLog = new AuditLog
                {
                    Id = Guid.NewGuid(),
                    TableName = entry.Entity.GetType().Name,
                    Action = entry.State.ToString(),
                    Timestamp = DateTime.UtcNow,
                };
                AuditLogs.Add(auditLog);
            }

            return await base.SaveChangesAsync(cancellationToken);
        }
    }
}
