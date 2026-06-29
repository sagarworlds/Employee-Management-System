using System;
using EMS.Domain.Entities;

namespace EMS.Application.Interfaces
{
    public interface ITokenService
    {
        string GenerateToken(ApplicationUser user, ApplicationRole role);
    }
}
