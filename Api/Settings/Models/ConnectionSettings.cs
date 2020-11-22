using Makerverse.Api.Machines.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Makerverse.Api.Settings.Models {
  public class ConnectionSettings : ILoadSettingsObject {
    [JsonProperty("port")]
    public string Port { get; set; } = default!;

    [JsonProperty("manufacturer")]
    public string? Manufacturer { get; set; }

    [JsonProperty("firmware")]
    public MachineFirmwareSettings Firmware { get; set; } = new();

    public void LoadSettings(JObject obj) {
      JsonConvert.PopulateObject(JsonConvert.SerializeObject(obj), this);
    }
  }
}
