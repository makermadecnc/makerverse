using HotChocolate.AspNetCore.Authorization;
using Makerverse.Api.Identity.Services;
using Makerverse.Lib.Graphql;

namespace Makerverse.Api.Connections.Models {
  [AuthorizeMakerverseUser]
  public class ConnectionPort {
    public string Name { get; set; }
  }
}
