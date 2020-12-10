using System.Collections.Generic;
using HotChocolate.AspNetCore.Authorization;
using Makerverse.Api.Identity.Services;
using Makerverse.Lib.Graphql;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Makerverse.Api.Settings.Models {
  [AuthorizeMakerverseUser]
  public class FileSystemSettings : ILoadSettingsObject {
    [JsonProperty("programDirectory")]
    public string ProgramDirectory { get; set; } = default!;

    [JsonProperty("mountPoints")]
    public List<MountPointSettings> MountPoints { get; set; } = new ();

    public void LoadSettings(JObject obj) {
      JsonConvert.PopulateObject(JsonConvert.SerializeObject(obj), this);
    }
  }
}
