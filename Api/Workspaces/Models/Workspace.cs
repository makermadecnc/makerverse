using System;
using System.Threading.Tasks;
using Makerverse.Api.Workspaces.Enums;
using Makerverse.Api.Workspaces.Services;
using OpenWorkEngine.OpenController.Controllers.Exceptions;
using OpenWorkEngine.OpenController.Lib;
using OpenWorkEngine.OpenController.Lib.Observables;
using OpenWorkEngine.OpenController.Machines.Models;
using OpenWorkEngine.OpenController.Ports.Enums;
using OpenWorkEngine.OpenController.Ports.Models;
using Serilog;

namespace Makerverse.Api.Workspaces.Models {
  /// <summary>
  /// In-memory representation of a single workspace. Lives as long as the workspace itself exists.
  /// </summary>
  public class Workspace : ITopicStateMessage<WorkspaceState>, IObserver<SystemPort>, IDisposable {
    public string Id => Settings.Id;

    public string TopicId => Id;

    public string PortName => Settings.Connection.PortName;

    public SystemPort? Port { get; private set; }

    public AlertError? Error { get; set; }

    public WorkspaceState State { get; set; } = WorkspaceState.Closed;

    public WorkspaceSettings Settings { get; internal set; }

    private WorkspaceManager Manager { get; }

    private ILogger Log { get; }

    internal async Task<Workspace> Open() {
      if (State >= WorkspaceState.Active) {
        Log.Debug("[WORKSPACE] already active {workspace}", ToString());
        return this;
      }
      Log.Debug("[WORKSPACE] beginning port-open");
      try {
        Manager.EmitState(this, WorkspaceState.Opening);
        Log.Information("[WORKSPACE] opening: {workspace}", ToString());
        SystemPort? port = Port;
        if (port == null) throw new PortException($"Port is not plugged in: {PortName}", PortName);

        // Open the controller by converting internal settings into OpenController types.
        await Manager.Ports.Controllers.Open(Settings.Connection);

        // Immediately update the port in case it was already open.
        UpdatePort(port);
      } catch (Exception e) {
        Log.Error(e, "[WORKSPACE] failed to open: {workspace}", ToString());
        Error = new AlertError(e);
        Manager.EmitState(this, WorkspaceState.Error);
      }
      return this;
    }

    private void UpdatePortState(SystemPort port) {
      PortState st = port.State;
      if (st == PortState.Unplugged) Manager.EmitState(this, WorkspaceState.Disconnected);
      if (st == PortState.Ready) Manager.EmitState(this, WorkspaceState.Closed);

      if (State == WorkspaceState.Opening) {
        if (st == PortState.Active) Manager.EmitState(this, WorkspaceState.Active);
        if (st == PortState.Error) {
          Error = port.Error ?? new AlertError(new PortException("Could not open port", port.PortName));
          Manager.EmitState(this, WorkspaceState.Error);
        }
      }
    }

    // Respond to ports appearing and disappearing by keeping the SystemPort up to date.
    private void UpdatePort(SystemPort? port) {
      Log.Debug("Update port {port} on {workspace}", port?.ToString(), ToString());
      if (port != null && !port.PortName.Equals(PortName)) return;
      bool hadPort = Port != null;
      bool hasPort = port != null;
      if (hadPort == hasPort && Port == port) {
        if (port != null) UpdatePortState(port);
        else Manager.EmitState(this, WorkspaceState.Disconnected);
        return;
      }
      Port = port;
      Log.Debug("[WORKSPACE] port updated: {workspace}", ToString());
      Manager.EmitState(this, hasPort ? WorkspaceState.Closed : WorkspaceState.Disconnected);
    }

    public Workspace(WorkspaceManager mgr, WorkspaceSettings settings) {
      Log = mgr.Log.ForContext("WorkspaceSettings", Settings).ForContext(GetType());
      Manager = mgr;
      Settings = settings;

      Manager.Ports.Map.TryGetValue(PortName, out SystemPort? port);
      UpdatePort(port);
      _portListSubscription = mgr.Ports
                                 .GetSubscriptionTopic(PortTopic.State)
                                 .SubscribeTopicId(PortName, this);
    }

    public override string ToString() => $"[{State}] /workspaces/{Id}:{Port?.PortName}";

    private readonly IDisposable _portListSubscription;
    public void OnCompleted() { }
    public void OnError(Exception error) { }
    public void OnNext(SystemPort value) => UpdatePort(value);

    public void Dispose() {
      State = WorkspaceState.Closed;
      _portListSubscription.Dispose();
    }
  }
}
