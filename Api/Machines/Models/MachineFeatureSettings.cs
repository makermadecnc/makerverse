using Makerverse.Api.Settings.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using OpenWorkEngine.OpenController.MachineProfiles.Interfaces;

namespace Makerverse.Api.Machines.Models {
  public class MachineFeatureSettings : IMachineFeature, ILoadSettingsObject {
    [JsonProperty("id")]
    public string? Id { get; set; }

    [JsonProperty("disabled")]
    public bool Disabled { get; set; } = false;

    [JsonProperty("key")]
    public string Key { get; set; } = default!;

    [JsonProperty("title")]
    public string? Title { get; set; }

    [JsonProperty("description")]
    public string? Description { get; set;  }

    [JsonProperty("icon")]
    public string? Icon { get; set; }

    public void LoadSettings(JObject obj) {
      JsonConvert.PopulateObject(JsonConvert.SerializeObject(obj), this);
    }
  }
}
