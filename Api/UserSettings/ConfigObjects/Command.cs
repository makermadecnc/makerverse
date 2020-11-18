namespace Makerverse.Api.UserSettings.ConfigObjects {
  public class Command {
    public string Id { get; set; } = default!;

    public ulong Mtime { get; set; } = default!;

    public bool Enabled { get; set; } = true;

    public string Title { get; set; } = default!;

    public string Commands { get; set; } = default!;
  }
}
