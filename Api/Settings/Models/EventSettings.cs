using HotChocolate.AspNetCore.Authorization;
using Makerverse.Api.Identity.Services;
using Makerverse.Lib.Graphql;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Makerverse.Api.Settings.Models {
  [AuthorizeMakerverseUser]
  public class EventSettings : ILoadSettingsObject {
    [JsonProperty("id")]
    public string Id { get; set; } = default!;

    [JsonProperty("mtime")]
    public long Mtime { get; set; } = default!;

    [JsonProperty("enabled")]
    public bool Enabled { get; set; } = true;

    [JsonProperty("event")]
    public string Event { get; set; } = default!;

    [JsonProperty("trigger")]
    public string Trigger { get; set; } = default!;

    [JsonProperty("commands")]
    public string Commands { get; set; } = default!;

    public void LoadSettings(JObject obj) {
      JsonConvert.PopulateObject(JsonConvert.SerializeObject(obj), this);
    }
  }
}
