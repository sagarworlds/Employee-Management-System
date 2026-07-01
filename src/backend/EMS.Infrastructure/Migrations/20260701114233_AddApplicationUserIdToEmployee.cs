using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EMS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddApplicationUserIdToEmployee : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "ApplicationUserId",
                table: "Employees",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ApplicationUserId",
                table: "Employees");
        }
    }
}
