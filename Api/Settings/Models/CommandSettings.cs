using HotChocolate.Types;
using Makerverse.Api.Settings.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Makerverse.Api.Workspaces.Models {
  public class CommandSettings : ILoadSettingsObject {
    [JsonProperty("id")]
    public string Id { get; set; } = default!;

    [JsonProperty("mtime")]
    public long Mtime { get; set; } = default!;

    [JsonProperty("enabled")]
    public bool Enabled { get; set; } = true;

    [JsonProperty("title")]
    public string Title { get; set; } = default!;

    [JsonProperty("commands")]
    public string Commands { get; set; } = default!;

    public void LoadSettings(JObject obj) {
      JsonConvert.PopulateObject(JsonConvert.SerializeObject(obj), this);
    }
  }
}
