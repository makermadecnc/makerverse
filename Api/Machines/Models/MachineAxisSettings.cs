using Makerverse.Api.Settings.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Linq;
using OpenWorkEngine.OpenController.MachineProfiles.Enums;
using OpenWorkEngine.OpenController.MachineProfiles.Interfaces;

namespace Makerverse.Api.Machines.Models {
  public class MachineAxisSettings : IMachineAxis, ILoadSettingsObject {
    [JsonProperty("id")]
    public string Id { get; set; }

    [JsonProperty("name")]
    [JsonConverter(typeof(StringEnumConverter))]
    public AxisName Name { get; set; }

    [JsonProperty("min")]
    public decimal Min { get; set; }

    [JsonProperty("max")]
    public decimal Max { get; set; }

    [JsonProperty("precision")]
    public decimal Precision { get; set; }

    [JsonProperty("accuracy")]
    public decimal Accuracy { get; set; }

    public void LoadSettings(JObject obj) {
      JsonConvert.PopulateObject(JsonConvert.SerializeObject(obj), this);
    }
  }
}
