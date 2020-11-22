using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using SemVersion;

namespace Makerverse.Api.Settings.Models {
  public class AppUpdates : ILoadSettingsObject {
    [JsonProperty("checkForUpdates")]
    public bool CheckForUpdates { get; set; } = true;

    [JsonProperty("prereleases")]
    public bool Prereleases { get; set; } = false;

    public void LoadSettings(JObject obj) {
      JsonConvert.PopulateObject(JsonConvert.SerializeObject(obj), this);
    }
  }
}
