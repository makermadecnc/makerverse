using System;
using System.Threading;
using System.Threading.Tasks;
using HotChocolate;
using HotChocolate.Types;
using Makerverse.Api.Workspaces.Enums;
using Makerverse.Api.Workspaces.Models;
using Makerverse.Api.Workspaces.Services;
using Makerverse.Lib.Graphql;
using OpenWorkEngine.OpenController.Controllers.Services;
using OpenWorkEngine.OpenController.Lib.Graphql;

namespace Makerverse.Api.Workspaces.Graph {
  [ExtendObjectType(Name = "Subscription")]
  public class WorkspaceSubscription {
    // General change method.
    // Workspace added, updated, or deleted... see its state.
    [Subscribe(With = nameof(SubscribeToAllWorkspaceState))]
    [AuthorizeMakerverseUser]
    public Task<Workspace> OnWorkspaceChange([EventMessage] Workspace workspace) => Task.FromResult(workspace);

    public ValueTask<IObservable<Workspace>> SubscribeToAllWorkspaceState(
      [Service] WorkspaceManager workspaceManager,
      CancellationToken ct
    ) => workspaceManager.SubscribeToAll(WorkspaceTopic.State, ct);
  }
}
