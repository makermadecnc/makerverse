using System.Collections.Generic;

namespace Makerverse.Api.UserSettings.ConfigObjects {
  public class FirmwareConfig {
    public string? Id { get; set; }

    public int BaudRate { get; set; }

    public string ControllerType { get; set; } = default!;

    public string Port { get; set; } = default!;

    public string? Manufacturer { get; set; }

    public bool Rtscts { get; set; }

    public decimal RequiredVersion { get; set; }

    public decimal SuggestedVersion { get; set; }

    public string? DownloadUrl { get; set; }

    public string? HelpUrl { get; set; }
  }

  public class AxisConfig {
    public decimal Min { get; set; }

    public decimal Max { get; set; }

    public decimal Precision { get; set; }

    public decimal Accuracy { get; set; }
  }

  public class PartConfig {
    public string Id { get; set; } = default!;

    public string PartType { get; set; } = default!;

    public string Title { get; set; } = default!;

    public string? Description { get; set; }

    public bool Optional { get; set; }

    public bool IsDefault { get; set; }

    public string? DataBlob { get; set; }
  }

  public class WorkspaceConfig {
    public string Id { get; set; } = default!;

    public string Name { get; set; } = default!;

    public bool Onboarded { get; set; }

    public string Path { get; set; } = default!;

    public string Color { get; set; } = default!;

    public string Icon { get; set; } = default!;

    public bool AutoReconnect { get; set; }

    public bool PreferImperial { get; set; }

    public FirmwareConfig Firmware { get; set; } = default!;

    public Dictionary<string, AxisConfig> Axes { get; set; } = default!;

    public Dictionary<string, List<string>> Commands { get; set; } = default!;

    public List<PartConfig> Parts { get; set; } = default!;
  }
}
