using System.Linq;
using HotChocolate;
using HotChocolate.Types;
using Makerverse.Api.Settings.Models;
using Makerverse.Api.Workspaces.Models;
using Makerverse.Lib;

namespace Makerverse.Api.Settings.Graph {
  [ExtendObjectType(Name = "Query")]
  public class SettingsQuery {
    [GraphQLName("getSettings")]
    public MakerverseSettings GetSettings([Service] MakerverseContext context) => context.Settings;

    [GraphQLName("getWorkspace")]
    public WorkspaceSettings Workspace([Service] MakerverseContext context, string idOrPath) =>
      context.Settings.Workspaces.First(ws => ws.Id.Equals(idOrPath) || ws.Path.Equals(idOrPath));
  }
}
