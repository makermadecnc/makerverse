using HotChocolate.Execution.Configuration;
using HotChocolate.Types.Descriptors.Definitions;
using Makerverse.Lib.Graphql;
using Microsoft.Extensions.DependencyInjection;

namespace Makerverse.Api.Controllers.Graph {
  public static class ControllersSchema {
    [UseMakerverseSettings]
    public static IRequestExecutorBuilder AddControllersSchema(this IRequestExecutorBuilder builder) =>
      builder
       .AddTypeExtension<ControllersQuery>()
       .AddTypeExtension<ControllersSubscription>()
       .AddTypeExtension<ControllersMutation>();
  }
}
