using System.Collections.Generic;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Makerverse.Api.Settings.Models {
  public class MakerverseUser : ILoadSettingsObject {
    public string? Id { get; set; }

    public string Username { get; set; } = default!;

    public string AuthenticationType { get; set; } = default!;

    public bool Enabled { get; set; } = true;

    public List<string> Tokens { get; set; } = new List<string>();

    public override string ToString() => Username;

    public void LoadSettings(JObject obj) {
      JsonConvert.PopulateObject(JsonConvert.SerializeObject(obj), this);
    }
  }
}
