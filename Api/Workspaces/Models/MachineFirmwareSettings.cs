using System;
using HotChocolate.Types;
using Makerverse.Api.Settings.Models;
using Makerverse.Lib.Graphql;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Linq;
using OpenWorkEngine.OpenController.MachineProfiles.Enums;
using OpenWorkEngine.OpenController.MachineProfiles.Interfaces;
using OpenWorkEngine.OpenController.Ports.Messages;

namespace Makerverse.Api.Workspaces.Models {
  [AuthorizeMakerverseUser]
  public class MachineFirmwareSettings : IMachineFirmware, ILoadSettingsObject {
    [JsonProperty("id")]
    public string? Id { get; set; }

    [JsonProperty("baudRate")]
    public BaudRate? BaudRate { get; set; }

    public int BaudRateValue {
      get => BaudRate == null ? 0 : (int) BaudRate;
      set => BaudRate = (BaudRate) value;
    }

    [JsonProperty("controllerType")]
    [JsonConverter(typeof(StringEnumConverter))]
    public MachineControllerType ControllerType { get; set; }

    [JsonProperty("name")] public string? Name { get; set; } = default!;

    [JsonProperty("edition")]
    public string? Edition { get; set; }

    [JsonProperty("rtscts")]
    public bool Rtscts { get; set; }

    [JsonProperty("requiredVersion")]
    public decimal RequiredVersion { get; set; }

    [JsonProperty("suggestedVersion")]
    public decimal SuggestedVersion { get; set; }

    [JsonProperty("downloadUrl")]
    public string? DownloadUrl { get; set; }

    [JsonProperty("helpUrl")]
    public string? HelpUrl { get; set; }

    public void LoadSettings(JObject obj) {
      JsonConvert.PopulateObject(JsonConvert.SerializeObject(obj), this);
    }

    public FirmwareRequirement ToRequirement() =>
      new FirmwareRequirement() { ControllerType = ControllerType, Name = Name };
  }
}
