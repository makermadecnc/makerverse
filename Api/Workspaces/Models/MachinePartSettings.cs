using System.Collections.Generic;
using Makerverse.Api.Settings.Models;
using Makerverse.Lib.Filesystem;
using Makerverse.Lib.Graphql;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Linq;
using OpenWorkEngine.OpenController.MachineProfiles.Enums;
using OpenWorkEngine.OpenController.MachineProfiles.Interfaces;

namespace Makerverse.Api.Workspaces.Models {
  [AuthorizeMakerverseUser]
  public class MachinePartSettings : IMachinePart<MachineSettingSettings, MachineSpecSettings>, ILoadSettingsObject {
    [JsonProperty("id")]
    public string? Id { get; set; } = default!;

    [JsonProperty("partType")]
    [JsonConverter(typeof(StringEnumConverter))]
    public MachinePartType PartType { get; set; } = default!;

    [JsonProperty("title")] public string Title { get; set; } = default!;

    [JsonProperty("description")]
    public string? Description { get; set; }

    [JsonProperty("optional")]
    public bool Optional { get; set; }

    [JsonProperty("isDefault")]
    public bool IsDefault { get; set; }

    [JsonProperty("dataBlob")] public string DataBlob { get; set; } = default!;

    [JsonProperty("settings")] public List<MachineSettingSettings> Settings { get; set; } = new();

    [JsonProperty("specs")] public List<MachineSpecSettings> Specs { get; set; } = new();

    public void LoadSettings(JObject obj) {
      Settings = LoadSettingsExtensions.LoadArray<MachineSettingSettings>(obj, "settings");
      obj.Remove("settings");

      Specs = LoadSettingsExtensions.LoadArray<MachineSpecSettings>(obj, "specs");
      obj.Remove("specs");

      JsonConvert.PopulateObject(JsonConvert.SerializeObject(obj), this);
    }
  }
}
