using Makerverse.Api.Settings.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using OpenWorkEngine.OpenController.MachineProfiles.Enums;
using OpenWorkEngine.OpenController.MachineProfiles.Interfaces;

namespace Makerverse.Api.Machines.Models {
  public class MachinePartSettings : IMachinePart, ILoadSettingsObject {
    [JsonProperty("checkForUpdates")]
    public string Id { get; set; } = default!;

    [JsonProperty("partType")]
    public MachinePartType PartType { get; set; } = default!;

    [JsonProperty("title")]
    public string Title { get; set; } = default!;

    [JsonProperty("description")]
    public string? Description { get; set; }

    [JsonProperty("optional")]
    public bool Optional { get; set; }

    [JsonProperty("isDefault")]
    public bool IsDefault { get; set; }

    [JsonProperty("dataBlob")]
    public string? DataBlob { get; set; }

    public void LoadSettings(JObject obj) {
      JsonConvert.PopulateObject(JsonConvert.SerializeObject(obj), this);
    }
  }
}
