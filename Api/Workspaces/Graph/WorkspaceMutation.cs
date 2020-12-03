using System;
using System.Data;
using System.Threading.Tasks;
using HotChocolate;
using HotChocolate.Types;
using Makerverse.Api.Workspaces.Messages;
using Makerverse.Api.Workspaces.Models;
using Makerverse.Lib.Graphql;
using OpenWorkEngine.OpenController.Lib.Graphql;
using OpenWorkEngine.OpenController.Ports.Models;

namespace Makerverse.Api.Workspaces.Graph {
  [ExtendObjectType(Name = "Mutation")]
  public class WorkspaceMutation {
    [AuthorizeMakerverseUser]
    public Task<WorkspaceSettings> CreateWorkspace(
      [Service] MakerverseContext makerverseContext,
      WorkspaceSettings workspaceSettings
    ) => makerverseContext.Workspaces.Create(workspaceSettings);

    [AuthorizeMakerverseUser]
    public Task<WorkspaceSettings> UpdateWorkspace(
      [Service] MakerverseContext makerverseContext,
      WorkspaceSettings workspaceSettings
    ) => makerverseContext.Workspaces.Update(workspaceSettings);

    [AuthorizeMakerverseUser]
    public Task<string> DeleteWorkspace([Service] MakerverseContext mv, string workspaceId)
      => mv.Workspaces.Delete(workspaceId);
  }
}
