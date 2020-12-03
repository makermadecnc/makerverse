using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using HotChocolate.Subscriptions;
using Makerverse.Api.Workspaces.Graph;
using Makerverse.Api.Workspaces.Messages;
using Makerverse.Api.Workspaces.Models;
using Makerverse.Api.Workspaces.Observables;
using Newtonsoft.Json;
using OpenWorkEngine.OpenController.Ports.Models;
using Serilog;

namespace Makerverse.Api.Workspaces.Services {
  public class WorkspaceManager {
    internal ILogger Log { get; }

    internal MakerverseContext Context { get; }

    internal ITopicEventSender Sender => Context.Sender;
    //
    // public WorkspaceSettings this[string workspaceId] =>
    //   Settings.TryGetValue(workspaceId, out WorkspaceSettings? val) ? val :
    //     throw new ArgumentException($"Workspace missing: {workspaceId}");

    private Dictionary<string, WorkspaceSettings> Settings =>
      Context.Settings.Workspaces.ToDictionary(ws => ws.Id, ws => ws);

    private ConcurrentDictionary<string, Workspace> _openWorkspaces =
      new ConcurrentDictionary<string, Workspace>();

    // Opening a workspace -> open port, ready for work.
    internal Task<Workspace> Open(string workspaceId) {
      WorkspaceSettings settings = Settings[workspaceId];
      Workspace state = _openWorkspaces.AddOrUpdate(
        workspaceId,
        (wsId) => new Workspace(settings),
        (wsId, existingState) => existingState
      );
      return Task.FromResult(state);
    }

    internal async Task<WorkspaceSettings> Create(WorkspaceSettings ws) {
      if (Settings.ContainsKey(ws.Id)) {
        throw new DuplicateNameException($"{ws.Id} already exists");
      }
      Log.Debug("[WORKSPACE] created: {workspace}", JsonConvert.SerializeObject(ws));
      Log.Information("[WORKSPACE] created: {workspaceName}", ws.Name);
      Context.Settings.Workspaces.Add(ws);
      Context.SaveSettings();
      await Sender.SendAsync(nameof(WorkspaceSubscription.OnWorkspacesChanged), new WorkspaceChange(ws));
      return ws;
    }

    internal async Task<WorkspaceSettings> Update(WorkspaceSettings ws) {
      Dictionary<string, WorkspaceSettings> map = Settings;
      if (!map.ContainsKey(ws.Id)) {
        throw new KeyNotFoundException($"{ws.Id} does not exist");
      }
      Log.Debug("[WORKSPACE] updated: {workspace}", JsonConvert.SerializeObject(ws));
      Log.Information("[WORKSPACE] updated: {workspaceName}", ws.Name);
      map[ws.Id] = ws;
      Context.Settings.Workspaces = map.Values.ToList();
      Context.SaveSettings();
      await Sender.SendAsync(nameof(WorkspaceSubscription.OnWorkspacesChanged), new WorkspaceChange(ws));
      return ws;
    }

    internal async Task<string> Delete(string workspaceId) {
      Dictionary<string, WorkspaceSettings> map = Settings;
      if (!map.ContainsKey(workspaceId)) {
        throw new KeyNotFoundException($"{workspaceId} does not exist");
      }
      map.Remove(workspaceId);

      Context.Settings.Workspaces = map.Values.ToList();
      Context.SaveSettings();
      await Sender.SendAsync(nameof(WorkspaceSubscription.OnWorkspacesChanged), new WorkspaceChange (workspaceId));
      return workspaceId;
    }

    public WorkspaceManager(MakerverseContext context) {
      Context = context;
      Log = context.Log.ForContext(typeof(WorkspaceManager));
    }
  }
}
