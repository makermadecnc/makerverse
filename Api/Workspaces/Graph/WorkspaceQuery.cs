using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HotChocolate;
using HotChocolate.Types;
using Makerverse.Api.Workspaces.Models;
using Makerverse.Lib.Graphql;

namespace Makerverse.Api.Workspaces.Graph {
  [ExtendObjectType(Name = "Query")]
  public class WorkspaceQuery {
    [AuthorizeMakerverseUser]
    [GraphQLName("getWorkspace")]
    public Workspace GetWorkspace([Service] MakerverseContext context, string workspaceId) =>
      context.Workspaces[workspaceId];

    [AuthorizeMakerverseUser]
    public List<Workspace> ListWorkspaces([Service] MakerverseContext context) => context.Workspaces.ToList();
  }
}
