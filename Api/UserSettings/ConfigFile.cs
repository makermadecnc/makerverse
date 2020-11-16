using Makerverse.Api.UserSettings.ConfigObjects;
using Serilog;

namespace Makerverse.Api.UserSettings {
  public class ConfigFile : WatchedJsonFile<MakerverseConfig> {
    public ConfigFile(ILogger logger) : base(logger, "./.makerverse") { }

    protected override void OnChanged(MakerverseConfig data) {
      base.OnChanged(data);
      Log.Information("Users: {users}", Data.Users);
      Log.Information("Workspaces: {@users}", Data.Workspaces);
    }
  }
}
