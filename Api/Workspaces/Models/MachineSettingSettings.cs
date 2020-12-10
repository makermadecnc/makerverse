using Makerverse.Api.Settings.Models;
using Makerverse.Lib.Graphql;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Linq;
using OpenWorkEngine.OpenController.MachineProfiles.Enums;
using OpenWorkEngine.OpenController.MachineProfiles.Interfaces;

namespace Makerverse.Api.Workspaces.Models {
  [AuthorizeMakerverseUser]
  public class MachineSettingSettings : IMachineSetting, ILoadSettingsObject {
    [JsonProperty("id")]
    public string Id { get; set; } = default!;

    [JsonProperty("title")]
    public string? Title { get; set; } = default!;

    [JsonProperty("settingType")]
    [JsonConverter(typeof(StringEnumConverter))]
    public MachineSettingType SettingType { get; set;  }

    [JsonProperty("key")]
    public string Key { get; set; } = default!;

    [JsonProperty("value")]
    public string Value { get; set; } = default!;

    public void LoadSettings(JObject obj) {
      JsonConvert.PopulateObject(JsonConvert.SerializeObject(obj), this);
    }
  }
}
