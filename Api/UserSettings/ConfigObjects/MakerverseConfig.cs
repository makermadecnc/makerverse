using System.Collections.Generic;
using Newtonsoft.Json;

namespace Makerverse.Api.UserSettings.ConfigObjects {
  public class MakerverseConfig {
    public ConfigState State { get; set; } = new ConfigState();

    public List<WorkspaceConfig> Workspaces = new List<WorkspaceConfig>();

    [JsonProperty(PropertyName = "users")]
    public List<MakerverseUser> Users = new List<MakerverseUser>();
  }
}
