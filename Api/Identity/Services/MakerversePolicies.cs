using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using OpenWorkEngine.OpenController.Lib;

namespace Makerverse.Api.Identity.Services {
  public static class MakerversePolicies {
    public static void AddMakerversePolicies(this AuthorizationOptions opts) {
      opts.AddPolicy(ControllerPolicies.ReadControllers,
        p => p.RequireAssertion(r => r.User.IsInRole(MakerverseRoles.User)));

      opts.AddPolicy(ControllerPolicies.WriteControllers,
        p => p.RequireAssertion(r => r.User.IsInRole(MakerverseRoles.User)));
    }
  }
}
