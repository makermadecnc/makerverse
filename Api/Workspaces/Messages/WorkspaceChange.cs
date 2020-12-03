using Makerverse.Api.Workspaces.Models;
using Makerverse.Api.Workspaces.Observables;

namespace Makerverse.Api.Workspaces.Messages {
  public class WorkspaceChange {
    public string WorkspaceId { get; set; }

    public Workspace? Workspace { get; set; }

    public WorkspaceChange(string workspaceId) {
      WorkspaceId = workspaceId;
    }

    public WorkspaceChange(WorkspaceSettings ws) {
      WorkspaceId = ws.Id;
      Workspace = new Workspace(ws);
    }
  }
}
