using HotChocolate.Execution.Configuration;
using Makerverse.Api.Connections.Graph;
using Makerverse.Api.Identity;
using Makerverse.Api.Identity.Graphql;
using Makerverse.Api.Machines.Graph;
using Makerverse.Api.Settings.Graph;
using Microsoft.Extensions.DependencyInjection;

namespace Makerverse.Api {
  public static class MakerverseSchema {
    public static IRequestExecutorBuilder AddMakerverseSchema(this IRequestExecutorBuilder builder) =>
      builder.AddQueryType(d => d.Name("Query"))
             .AddConnectionsSchema()
             .AddIdentitySchema()
             .AddMachinesSchema()
             .AddSettingsSchema();
  }
}
