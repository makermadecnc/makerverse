using Makerverse.Api.Settings.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Linq;
using OpenWorkEngine.OpenController.MachineProfiles.Enums;
using OpenWorkEngine.OpenController.MachineProfiles.Interfaces;

namespace Makerverse.Api.Machines.Models {
  public class MachineSpecSettings : IMachineSpec, ILoadSettingsObject {
    [JsonProperty("id")]
    public string Id { get; set; } = default!;

    [JsonProperty("specType")]
    [JsonConverter(typeof(StringEnumConverter))]
    public MachineSpecType SpecType { get; set; }

    [JsonProperty("value")]
    public decimal Value { get; set; }

    public void LoadSettings(JObject obj) {
      JsonConvert.PopulateObject(JsonConvert.SerializeObject(obj), this);
    }
  }
}
