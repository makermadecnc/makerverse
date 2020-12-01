using HotChocolate.AspNetCore.Authorization;
using Makerverse.Api.Identity.Services;
using Makerverse.Api.Workspaces.Models;
using Makerverse.Lib.Graphql;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Makerverse.Api.Settings.Models {
  [AuthorizeMakerverseUser]
  public class ConnectionSettings : ILoadSettingsObject {
    [JsonProperty("port")]
    public string PortName { get; set; } = default!;

    [JsonProperty("manufacturer")]
    public string? Manufacturer { get; set; }

    [JsonProperty("firmware")]
    public MachineFirmwareSettings Firmware { get; set; } = new();

    public void LoadSettings(JObject obj) {
      JsonConvert.PopulateObject(JsonConvert.SerializeObject(obj), this);
    }
  }
}
