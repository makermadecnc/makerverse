using System;
using System.Globalization;
using System.Security.Claims;
using System.Security.Principal;
using System.Threading;
using System.Threading.Tasks;
using HotChocolate.AspNetCore;
using HotChocolate.AspNetCore.Subscriptions;
using HotChocolate.AspNetCore.Subscriptions.Messages;
using HotChocolate.Execution;
using Makerverse.Api.Settings.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using Serilog;

namespace Makerverse.Api.Identity.Services {
  public static class IdentityExtensions {
    public static async Task<ClaimsPrincipal?> ClaimMakerverseIdentity(this HttpContext httpContext, string token) {
      IdentityService identityService = httpContext.RequestServices.GetRequiredService<IdentityService>();
      try {
        MakerverseSession session = await identityService.Authenticate(token);

        GenericIdentity identity = new (session.User.Username);
        GenericPrincipal principal = new (identity, session.Roles);

        Log.Debug("Created principal '{username}' with roles: {roles}", session.User.Username, session.Roles);
        return principal;
      } catch (Exception e) {
        Log.Warning(e, "Failed to authenticate user via token.");
      }
      return null;
    }
  }
}
