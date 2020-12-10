using HotChocolate.Execution.Configuration;
using Makerverse.Api.Identity;
using Makerverse.Api.Identity.Graphql;
using Makerverse.Api.Settings.Graph;
using Makerverse.Api.Workspaces.Graph;
using Microsoft.Extensions.DependencyInjection;
using OpenWorkEngine.OpenController;
using OpenWorkEngine.OpenController.Machines.Graph;

namespace Makerverse.Api {
  public static class MakerverseSchema {
    public static IRequestExecutorBuilder AddMakerverseSchema(this IRequestExecutorBuilder builder) =>
      builder.AddQueryType(d => d.Name("Query"))
             .AddSubscriptionType(d => d.Name("Subscription"))
             .AddMutationType(d => d.Name("Mutation"))
             .AddOpenControllerSchema()
             .AddIdentitySchema()
             .AddSettingsSchema()
             .AddWorkspaceSchema()
             .AddMachineSchema();
  }
}
