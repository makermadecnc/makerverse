using System;
using System.IO;
using Newtonsoft.Json;
using Serilog;

namespace Makerverse.Api.UserSettings {
  public abstract class WatchedJsonFile<TJson> : IDisposable {
    public TJson? Data { get; protected set; }

    protected ILogger Log { get; }

    private readonly FileSystemWatcher _watcher;

    private readonly string _path;

    private const string DefaultContents = "{}";

    private string? _lastContents = null;

    public WatchedJsonFile(ILogger logger, string path) {
      _path = path;
      Log = logger.ForContext("SettingsFile", path);

      _watcher = new FileSystemWatcher {
        Path = Path.GetDirectoryName(path) ?? throw new InvalidOperationException(),
        Filter = Path.GetFileName(path),
        NotifyFilter = NotifyFilters.LastAccess | NotifyFilters.LastWrite,
      };

      // Add event handlers.
      _watcher.Changed += OnChanged;
      _watcher.Created += OnChanged;
      _watcher.Deleted += OnChanged;

      // Begin watching.
      _watcher.EnableRaisingEvents = true;

      Reload();
    }

    protected virtual void OnChanged(TJson data) {
      Data = data;
      Log.Information("Loaded new {filename} data: {@data}", _path, Data);
    }

    private void Reload() {
      string contents = DefaultContents;
      TJson? data;
      try {
        contents = File.ReadAllText(_path);
        data = JsonConvert.DeserializeObject<TJson>(contents);
      } catch (Exception e) {
        Log.Error(e, $"Failed to read {_path}");
        return;
      }

      if (_lastContents != null && contents.Equals(_lastContents)) {
        return;
      }

      _lastContents = contents;
      OnChanged(data);
    }

    private void OnChanged(object source, FileSystemEventArgs e) {
      Reload();
    }

    public void Dispose() {
      _watcher.Dispose();
    }

    public override string ToString() => $"{_path} [{_lastContents?.Length ?? -1}]";
  }
}
