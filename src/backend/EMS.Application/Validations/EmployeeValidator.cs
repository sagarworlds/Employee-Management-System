using FluentValidation;
using EMS.Application.DTOs;

namespace EMS.Application.Validations
{
    public class CreateEmployeeValidator : AbstractValidator<CreateEmployeeDto>
    {
        public CreateEmployeeValidator()
        {
            RuleFor(x => x.FirstName).NotEmpty().MaximumLength(100);
            RuleFor(x => x.LastName).NotEmpty().MaximumLength(100);
            RuleFor(x => x.Email).NotEmpty().EmailAddress().MaximumLength(255);
            RuleFor(x => x.Phone).NotEmpty().MaximumLength(20);
            RuleFor(x => x.DateOfBirth).LessThan(System.DateTime.UtcNow);
            RuleFor(x => x.Gender).NotEmpty();
            RuleFor(x => x.DateOfJoining).NotEmpty();
            RuleFor(x => x.DepartmentId).NotEmpty();
            RuleFor(x => x.DesignationId).NotEmpty();
            RuleFor(x => x.Salary).GreaterThan(0);
        }
    }

    public class UpdateEmployeeValidator : AbstractValidator<UpdateEmployeeDto>
    {
        public UpdateEmployeeValidator()
        {
            RuleFor(x => x.FirstName).NotEmpty().MaximumLength(100);
            RuleFor(x => x.LastName).NotEmpty().MaximumLength(100);
            RuleFor(x => x.Email).NotEmpty().EmailAddress().MaximumLength(255);
            RuleFor(x => x.Phone).NotEmpty().MaximumLength(20);
            RuleFor(x => x.DateOfBirth).LessThan(System.DateTime.UtcNow);
            RuleFor(x => x.Gender).NotEmpty();
            RuleFor(x => x.DateOfJoining).NotEmpty();
            RuleFor(x => x.DepartmentId).NotEmpty();
            RuleFor(x => x.DesignationId).NotEmpty();
            RuleFor(x => x.Salary).GreaterThan(0);
        }
    }
}
