using System.Linq;
using HotChocolate;
using HotChocolate.Types;
using Makerverse.Api.Settings.Models;
using Makerverse.Lib;

namespace Makerverse.Api.Settings.Graph {
  [ExtendObjectType(Name = "Query")]
  public class SettingsQuery {
    public MakerverseSettings Settings([Service] MakerverseContext context) => context.Settings;

    public WorkspaceSettings Workspace([Service] MakerverseContext context, string idOrPath) =>
      context.Settings.Workspaces.First(ws => ws.Id.Equals(idOrPath) || ws.Path.Equals(idOrPath));
  }
}
