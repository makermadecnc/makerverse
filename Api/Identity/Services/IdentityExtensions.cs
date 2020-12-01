using System;
using System.Security.Claims;
using System.Security.Principal;
using System.Threading.Tasks;
using Makerverse.Api.Settings.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;

namespace Makerverse.Api.Identity.Services {
  public static class IdentityExtensions {
    public static async Task<ClaimsPrincipal?> ClaimMakerverseIdentity(this HttpContext httpContext, string token) {
      IdentityService identityService = httpContext.RequestServices.GetRequiredService<IdentityService>();
      try {
        MakerverseSession session = await identityService.Authenticate(token);

        GenericIdentity identity = new (session.User.Username);
        GenericPrincipal principal = new (identity, session.Roles);

        identityService.Log.Debug("[ID] create principal '{username}' with roles: {roles}", session.User.Username, session.Roles);
        return principal;
      } catch (Exception e) {
        identityService.Log.Warning(e, "[ID] Failed to authenticate user via token.");
      }
      return null;
    }
  }
}
