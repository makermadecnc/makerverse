using HotChocolate.Execution.Configuration;
using Makerverse.Api.Settings.Graph;
using Makerverse.Lib;
using Makerverse.Lib.Graphql;
using Microsoft.Extensions.DependencyInjection;

namespace Makerverse.Api.Connections.Graph {
  public static class ConnectionsSchema {
    [UseMakerverseSettings]
    public static IRequestExecutorBuilder AddConnectionsSchema(this IRequestExecutorBuilder builder) =>
      builder
       .AddType<ConnectionsQuery>();
  }
}
