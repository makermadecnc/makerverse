using Makerverse.Api.Settings.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Linq;
using OpenWorkEngine.OpenController.MachineProfiles.Enums;
using OpenWorkEngine.OpenController.MachineProfiles.Interfaces;

namespace Makerverse.Api.Machines.Models {
  public class MachineFirmwareSettings : IMachineFirmware, ILoadSettingsObject {
    [JsonProperty("id")]
    public string? Id { get; set; }

    [JsonProperty("baudRate")]
    public BaudRate BaudRate { get; set; }

    [JsonProperty("controllerType")]
    [JsonConverter(typeof(StringEnumConverter))]
    public MachineControllerType ControllerType { get; set; } = default!;

    [JsonProperty("name")]
    public string Name { get; set; } = default!;

    [JsonProperty("edition")]
    public string Edition { get; set; } = default!;

    [JsonProperty("rtscts")]
    public bool Rtscts { get; set; }

    [JsonProperty("requiredVersion")]
    public decimal RequiredVersion { get; set; }

    [JsonProperty("suggestedVersion")]
    public decimal SuggestedVersion { get; set; }

    [JsonProperty("downloadUrl")]
    public string DownloadUrl { get; set; } = default!;

    [JsonProperty("helpUrl")]
    public string HelpUrl { get; set; } = default!;

    public void LoadSettings(JObject obj) {
      JsonConvert.PopulateObject(JsonConvert.SerializeObject(obj), this);
    }
  }
}
