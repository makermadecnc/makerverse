using Makerverse.Api.Workspaces.Enums;
using Makerverse.Api.Workspaces.Models;
using OpenWorkEngine.OpenController.Machines.Interfaces;

namespace Makerverse.Api.Workspaces.Observables {
  // State management object for a single Workspace in-memory.
  public class Workspace : ITopic {
    public string WorkspaceId { get; }

    public WorkspaceState State { get; } = WorkspaceState.Closed;

    public WorkspaceSettings Settings { get; }

    internal WorkspaceTopicSet Topics { get; }

    public Workspace(WorkspaceSettings settings) {
      WorkspaceId = settings.Id;
      Settings = settings;
      Topics = new WorkspaceTopicSet();
    }
  }
}
