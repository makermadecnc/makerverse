using System.Collections.Generic;
using Newtonsoft.Json;

namespace Makerverse.Api.UserSettings.ConfigObjects {
  public class MakerverseConfig {
    public string WatchDirectory { get; set; } = default!;

    public ConfigState State { get; set; } = new ConfigState();

    public List<WorkspaceConfig> Workspaces = new List<WorkspaceConfig>();

    public List<Command> Commands = new List<Command>();

    [JsonProperty(PropertyName = "users")]
    public List<MakerverseUser> Users = new List<MakerverseUser>();
  }
}
