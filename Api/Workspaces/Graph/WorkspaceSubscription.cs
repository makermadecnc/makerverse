using System.Threading.Tasks;
using HotChocolate;
using HotChocolate.Types;
using Makerverse.Api.Workspaces.Messages;
using Makerverse.Api.Workspaces.Observables;
using Makerverse.Lib.Graphql;
using OpenWorkEngine.OpenController.Lib.Graphql;

namespace Makerverse.Api.Workspaces.Graph {
  [ExtendObjectType(Name = "Subscription")]
  public class WorkspaceSubscription {
    // General change method.
    // Workspace added, updated, or deleted.
    // Or, state change.
    [Subscribe]
    [Topic]
    [AuthorizeMakerverseUser]
    public Task<WorkspaceChange> OnWorkspacesChanged([EventMessage] WorkspaceChange change) =>
      Task.FromResult(change);

    // Main connection method to subscribe to a workspace.
    // If not open, the workspace becomes open (including, port connection).
    [AuthorizeMakerverseUser]
    public Task<Workspace> OpenWorkspace([Service] MakerverseContext mv, string workspaceId) =>
      mv.Workspaces.Open(workspaceId);
  }
}
