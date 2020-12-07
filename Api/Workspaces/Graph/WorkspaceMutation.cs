using System;
using System.Data;
using System.Threading.Tasks;
using HotChocolate;
using HotChocolate.Types;
using Makerverse.Api.Workspaces.Models;
using Makerverse.Lib.Graphql;
using OpenWorkEngine.OpenController.Lib.Graphql;
using OpenWorkEngine.OpenController.Ports.Models;

namespace Makerverse.Api.Workspaces.Graph {
  [ExtendObjectType(Name = "Mutation")]
  public class WorkspaceMutation {
    [AuthorizeMakerverseUser]
    public Workspace CreateWorkspace(
      [Service] MakerverseContext makerverseContext,
      WorkspaceSettings workspaceSettings
    ) => makerverseContext.Workspaces.Create(workspaceSettings);

    [AuthorizeMakerverseUser]
    public Workspace UpdateWorkspace(
      [Service] MakerverseContext makerverseContext,
      WorkspaceSettings workspaceSettings
    ) => makerverseContext.Workspaces.Update(workspaceSettings);

    [AuthorizeMakerverseUser]
    public Workspace DeleteWorkspace([Service] MakerverseContext makerverseContext, string workspaceId)
      => makerverseContext.Workspaces.Delete(workspaceId);

    [AuthorizeMakerverseUser]
    public Task<Workspace> OpenWorkspace([Service] MakerverseContext makerverseContext, string workspaceId)
      => makerverseContext.Workspaces[workspaceId].Open();
  }
}
