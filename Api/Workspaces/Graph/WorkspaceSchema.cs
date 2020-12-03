using HotChocolate.Execution.Configuration;
using Makerverse.Api.Workspaces.Models;
using Makerverse.Lib.Graphql;
using Microsoft.Extensions.DependencyInjection;

namespace Makerverse.Api.Workspaces.Graph {
  public static class WorkspaceSchema {
    [UseMakerverseSettings]
    public static IRequestExecutorBuilder AddWorkspaceSchema(this IRequestExecutorBuilder builder) =>
      builder
       .AddType<WorkspaceMutation>()
       .AddType<WorkspaceQuery>()
       .AddType<WorkspaceSubscription>();
  }
}
