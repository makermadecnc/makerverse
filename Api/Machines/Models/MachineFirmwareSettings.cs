using HotChocolate.AspNetCore.Authorization;
using HotChocolate.Types;
using Makerverse.Api.Identity.Services;
using Makerverse.Api.Settings.Models;
using Makerverse.Lib.Graphql;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Linq;
using OpenWorkEngine.OpenController.MachineProfiles.Enums;
using OpenWorkEngine.OpenController.MachineProfiles.Interfaces;

namespace Makerverse.Api.Machines.Models {
  public class MachineFirmwareSettingsType : ObjectType<MachineFirmwareSettings> {
    protected override void Configure(IObjectTypeDescriptor<MachineFirmwareSettings> descriptor) {
      base.Configure(descriptor);

      descriptor.Field("baudRate").Resolve(r => (decimal)r.Parent<MachineFirmwareSettings>().BaudRate);
    }
  }

  [AuthorizeMakerverseUser]
  public class MachineFirmwareSettings : IMachineFirmware, ILoadSettingsObject {
    [JsonProperty("id")]
    public string? Id { get; set; }

    [JsonProperty("baudRate")]
    public BaudRate BaudRate { get; set; }

    [JsonProperty("controllerType")]
    [JsonConverter(typeof(StringEnumConverter))]
    public MachineControllerType ControllerType { get; set; }

    [JsonProperty("name")]
    public string? Name { get; set; }

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
  }
}
