using System.Threading.Tasks;
using HotChocolate;
using HotChocolate.Types;
using Makerverse.Api.Identity.Services;
using Makerverse.Api.Settings.Models;

namespace Makerverse.Api.Identity.Graphql {
  [ExtendObjectType(Name = "Query")]
  public class IdentityQuery {

    public Task<MakerverseSession> Authenticate([Service] IdentityService identityService, string token) =>
      identityService.Authenticate(token);
  }
}
