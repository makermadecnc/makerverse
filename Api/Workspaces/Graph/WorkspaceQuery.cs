using System;
using System.Threading.Tasks;
using HotChocolate;
using HotChocolate.Types;
using Makerverse.Api.Workspaces.Models;
using Makerverse.Lib.Graphql;

namespace Makerverse.Api.Workspaces.Graph {
  [ExtendObjectType(Name = "Query")]
  public class WorkspaceQuery {
    [AuthorizeMakerverseUser]
    public Task<WorkspaceSettings> GetWorkspace(
      [Service] MakerverseContext makerverseContext,
      string? workspaceName, string? workspaceId
    ) {
      throw new NotImplementedException();
    }
  }
}
