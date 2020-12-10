using HotChocolate.AspNetCore.Authorization;
using Makerverse.Api.Identity.Services;
using Makerverse.Api.Workspaces.Models;
using Makerverse.Lib.Graphql;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using OpenWorkEngine.OpenController.Machines.Interfaces;
using OpenWorkEngine.OpenController.Ports.Interfaces;
using OpenWorkEngine.OpenController.Ports.Messages;
using OpenWorkEngine.OpenController.Ports.Models;

namespace Makerverse.Api.Settings.Models {
  [AuthorizeMakerverseUser]
  public class ConnectionSettings : IMachineConnectionSettings, ILoadSettingsObject {
    [JsonProperty("port")]
    public string PortName { get; set; } = default!;

    public string? MachineProfileId { get; internal set; }

    public IMachineFirmwareRequirement GetFirmwareRequirement() => Firmware;

    [JsonProperty("manufacturer")]
    public string? Manufacturer { get; set; }

    [JsonProperty("firmware")]
    public MachineFirmwareSettings Firmware { get; set; } = new();

    public void LoadSettings(JObject obj) {
      JsonConvert.PopulateObject(JsonConvert.SerializeObject(obj), this);
    }

    public ISerialPortOptions ToSerialPortOptions() => new SerialPortOptions() {
      BaudRate = Firmware.BaudRateValue,
      RtsEnable = Firmware.Rtscts,
    };
  }
}
