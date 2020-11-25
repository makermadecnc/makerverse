using System.Linq;
using System.Reflection;
using HotChocolate.AspNetCore.Authorization;
using HotChocolate.Types;
using HotChocolate.Types.Descriptors;
using Makerverse.Api.Identity.Services;

namespace Makerverse.Lib.Graphql {
  public class AuthorizeMakerverseUserAttribute : AuthorizeAttribute {
    protected override void TryConfigure(IDescriptorContext context, IDescriptor descriptor, ICustomAttributeProvider element) {
      string[] existingRoles = Roles ?? new string[] {};
      string[] requiredRoles = new[] {MakerverseRoles.User};
      Roles = existingRoles.Concat(requiredRoles).Distinct().ToArray();
      base.TryConfigure(context, descriptor, element);
    }
  }
}
