using System;
using System.Collections.Generic;
using System.Linq;
using HotChocolate.Types;
using Makerverse.Api.Machines.Models;
using Makerverse.Lib.Filesystem;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using OpenWorkEngine.OpenController.MachineProfiles.Enums;
using Serilog;

namespace Makerverse.Api.Settings.Models {
  public class WorkspaceConfigType : ObjectType<WorkspaceSettings> {

  }

  public class WorkspaceSettings : ILoadSettingsObject {
    [JsonProperty("id")]
    public string Id { get; set; } = default!;

    [JsonProperty("name")]
    public string Name { get; set; } = default!;

    [JsonProperty("onboarded")]
    public bool Onboarded { get; set; }

    [JsonProperty("path")]
    public string Path { get; set; } = default!;

    [JsonProperty("color")]
    public string Color { get; set; } = default!;

    [JsonProperty("icon")]
    public string Icon { get; set; } = default!;

    [JsonProperty("autoReconnect")]
    public bool AutoReconnect { get; set; }

    [JsonProperty("preferImperial")]
    public bool PreferImperial { get; set; }

    [JsonProperty("connection")]
    public ConnectionSettings Connection { get; set; } = new ();

    [JsonProperty("features")]
    public Dictionary<string, MachineFeatureSettings> Features { get; set; } = new();

    [JsonProperty("axes")]
    public Dictionary<string, MachineAxisSettings> Axes { get; set; } = new();

    [JsonProperty("commands")]
    public Dictionary<string, MachineCommandSettings> Commands { get; set; } = new();

    [JsonProperty("parts")]
    public List<MachinePartSettings> Parts { get; set; } = new();

    public void LoadSettings(JObject obj) {
      this.AssignScalarValue<string>(obj, "id", v => Id = v);
      this.AssignScalarValue<string>(obj, "name", v => Name = v);
      this.AssignScalarValue<bool>(obj, "onboarded", v => Onboarded = v);
      this.AssignScalarValue<string>(obj, "path", v => Path = v);
      this.AssignScalarValue<string>(obj, "color", v => Color = v);
      this.AssignScalarValue<string>(obj, "icon", v => Icon = v);
      this.AssignScalarValue<bool>(obj, "autoReconnect", v => AutoReconnect = v);
      this.AssignScalarValue<bool>(obj, "preferImerial", v => PreferImperial = v);

      if (obj["controller"] is JObject cont) {
        Connection.LoadSettings(cont);
        Connection.Firmware.LoadSettings(cont);
      }
      if (obj["firmware"] is JObject fw) {
        Connection.LoadSettings(fw);
        Connection.Firmware.LoadSettings(fw);
      }
      if (obj["connection"] is JObject conn) {
        Connection.LoadSettings(conn);
      }

      Features = LoadSettingsExtensions.LoadDictionary(obj, "features", (key, token) => {
        if (!(token is JObject obj)) {
          // Disabled = boolean in legacy.
          return new MachineFeatureSettings() {Key = key, Disabled = true};
        }
        return LoadSettingsExtensions.Build<MachineFeatureSettings>(token as JObject);
      });
      Axes = LoadSettingsExtensions.LoadDictionary(obj, "axes", (key, token) => {
        MachineAxisSettings axis = LoadSettingsExtensions.Build<MachineAxisSettings>(token as JObject);
        if (Enum.TryParse(key, true, out AxisName name)) axis.Name = name;
        return axis;
      });
      Commands = LoadSettingsExtensions.LoadDictionary<MachineCommandSettings>(obj, "commands", (key, token) => {
        if (token is JArray arr) {
          // Legacy: array of strings.
          MachineCommandSettings cmd = new();
          cmd.Id = key;
          cmd.Name = key;
          List<string> cmds = arr.Select(t => t as JValue).Where(v => v != null).Select(v => v.Value<string>()).ToList();
          cmd.Value = string.Join('\n', cmds);
          return cmd;
        }
        return LoadSettingsExtensions.Build<MachineCommandSettings>(token);
      });

      Parts = LoadSettingsExtensions.LoadArray<MachinePartSettings>(obj, "parts");
    }
  }
}
