using HotChocolate.Execution.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Makerverse.Api.Identity.Graphql {
  public static class IdentitySchema {
    public static IRequestExecutorBuilder AddIdentitySchema(this IRequestExecutorBuilder builder) =>
      builder
       .AddType<IdentityQuery>();
  }
}
