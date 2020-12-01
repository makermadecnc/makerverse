namespace Makerverse.Api.Settings.Models {
  public class MakerverseSession {
    public string Token { get; set; } = default!;

    public MakerverseUser User { get; set; } = default!;

    public string[] Roles { get; set; } = default!;

    public override string ToString() => $"{User} <r:{string.Join(',', Roles)}>";
  }
}
