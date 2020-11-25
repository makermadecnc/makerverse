using System.Collections.Generic;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Makerverse.Api.Settings.Models {
  public class MakerverseUser : ILoadSettingsObject {
    [JsonProperty("id")]
    public string? Id { get; set; }

    [JsonProperty("username")]
    public string Username { get; set; } = default!;

    [JsonProperty("authenticationType")]
    public string AuthenticationType { get; set; } = default!;

    [JsonProperty("enabled")]
    public bool Enabled { get; set; } = true;

    [JsonProperty("tokens")]
    public List<string> Tokens { get; set; } = new List<string>();

    public override string ToString() => Username;

    public void LoadSettings(JObject obj) {
      JsonConvert.PopulateObject(JsonConvert.SerializeObject(obj), this);
    }
  }
}
