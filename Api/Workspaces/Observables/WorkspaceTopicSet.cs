using Makerverse.Api.Workspaces.Messages;
using Makerverse.Api.Workspaces.Models;
using OpenWorkEngine.OpenController.Lib;

namespace Makerverse.Api.Workspaces.Observables {
  public class WorkspaceTopicSet {
    public SubscriptionTopic<Workspace> WorkspaceState { get; } = new();

    public SubscriptionTopic<Workspace> WorkspaceSettings { get; } = new();
  }
}
