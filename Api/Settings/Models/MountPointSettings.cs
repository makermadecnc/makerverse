using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Makerverse.Api.Settings.Models {
  public class MountPointSettings : ILoadSettingsObject {
    [JsonProperty("route")]
    public string Route { get; set; } = default!;

    [JsonProperty("target")]
    public string Target { get; set; } = default!;

    public void LoadSettings(JObject obj) {
      JsonConvert.PopulateObject(JsonConvert.SerializeObject(obj), this);
    }
  }
}
