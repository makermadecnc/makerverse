using System.Collections.Generic;
using System.Linq;
using HotChocolate.AspNetCore.Authorization;
using Makerverse.Api.Identity.Services;
using Makerverse.Lib.Filesystem;
using Makerverse.Lib.Graphql;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Serilog;

namespace Makerverse.Api.Settings.Models {
  [AuthorizeMakerverseUser]
  public class MakerverseSettings : ILoadSettingsObject {
    [JsonProperty("fileSystem")]
    public FileSystemSettings FileSystem { get; set; } = new ();

    [JsonProperty("appUpdates")]
    public AppUpdates AppUpdates { get; set; } = new ();

    [JsonProperty("workspaces")]
    public List<WorkspaceSettings> Workspaces { get; set; } = new ();

    [JsonProperty("commands")]
    public List<CommandSettings> Commands { get; set; } = new ();

    [JsonProperty("events")]
    public List<EventSettings> Events { get; set; } = new ();

    [JsonProperty("macros")]
    public List<MacroSettings> Macros { get; set; } = new ();

    [JsonProperty("users")]
    public List<MakerverseUser> Users { get; set; } = new ();

    [JsonProperty("hub")] public MakerHubSettings Hub { get; set; } = new();

    public void LoadSettings(JObject obj) {
      if (obj["watchDirectory"] is JValue wd) FileSystem.ProgramDirectory = wd.Value<string>(); // Legacy.
      FileSystem.MountPoints = LoadSettingsExtensions.LoadArray<MountPointSettings>(obj, "mountPoints"); // Legacy.
      if (obj["fileSystem"] is JObject fs) FileSystem.LoadSettings(fs);

      if (obj["state"] is JObject st) AppUpdates.LoadSettings(st); // Legacy.
      if (obj["appUpdates"] is JObject av) AppUpdates.LoadSettings(av);

      Workspaces = LoadSettingsExtensions.LoadArray<WorkspaceSettings>(obj, "workspaces");
      Commands = LoadSettingsExtensions.LoadArray<CommandSettings>(obj, "commands");
      Events = LoadSettingsExtensions.LoadArray<EventSettings>(obj, "events");
      Macros = LoadSettingsExtensions.LoadArray<MacroSettings>(obj, "macros");
      Users = LoadSettingsExtensions.LoadArray<MakerverseUser>(obj, "users");

      Log.Verbose("Loaded Settings {@workspace}", JsonConvert.SerializeObject(this, Formatting.Indented));
    }
  }
}
