using Makerverse.Api.Settings;
using Makerverse.Api.Settings.Models;
using Newtonsoft.Json.Linq;
using Serilog;

namespace Makerverse.Lib {
  public class ConfigFile : WatchedJsonFile<MakerverseSettings> {
    private readonly MakerverseSettings _settings = new ();

    public ConfigFile(ILogger logger) : base(logger, "./.makerverse") { }

    protected override void OnChanged(MakerverseSettings data) {
      base.OnChanged(data);
      // Log.Information("Users: {users}", Data.Users);
      // Log.Information("Commands: {@commands}", Data.Commands);
      Log.Information("Workspaces: {@workspaces}", Data.Workspaces);
    }

    protected override MakerverseSettings Load(JObject obj) {
      _settings.LoadSettings(obj);
      return _settings;
    }
  }
}
