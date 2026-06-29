using FluentValidation;
using EMS.Application.DTOs;

namespace EMS.Application.Validations
{
    public class CreateDesignationValidator : AbstractValidator<CreateDesignationDto>
    {
        public CreateDesignationValidator()
        {
            RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
        }
    }

    public class UpdateDesignationValidator : AbstractValidator<UpdateDesignationDto>
    {
        public UpdateDesignationValidator()
        {
            RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
        }
    }
}
