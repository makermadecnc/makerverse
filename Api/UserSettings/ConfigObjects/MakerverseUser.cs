using System.Collections.Generic;

namespace Makerverse.Api.UserSettings.ConfigObjects {
  public class MakerverseUser {
    public string Username { get; set; } = default!;

    public string AuthenticationType { get; set; } = default!;

    public bool Enabled { get; set; } = true;

    public List<string> Tokens { get; set; } = new List<string>();

    public override string ToString() => Username;
  }
}
