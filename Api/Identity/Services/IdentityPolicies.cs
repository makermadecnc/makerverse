using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace Makerverse.Api.Identity.Services {
  public static class IdentityPolicies {
    public static void AddMakerversePolicies(this AuthorizationOptions opts) {
      // opts.AddPolicy(User, p => p.RequireAssertion(r => r.User != null && r.User.HasClaim(c => c.Type.Equals(ClaimTypes.Name))));
    }
  }
}
