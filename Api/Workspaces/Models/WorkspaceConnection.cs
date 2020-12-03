using System;
using Makerverse.Api.Workspaces.Messages;

namespace Makerverse.Api.Workspaces.Models {
  public class WorkspaceConnection : IObservable<WorkspaceChange>, IDisposable {
    public IDisposable Subscribe(IObserver<WorkspaceChange> observer) => throw new NotImplementedException();
    public void Dispose() { }
  }
}
