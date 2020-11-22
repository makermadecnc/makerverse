using HotChocolate.Execution.Configuration;
using Makerverse.Api.Settings.Graph;
using Microsoft.Extensions.DependencyInjection;

namespace Makerverse.Api {
  public static class MakerverseSchema {
    public static IRequestExecutorBuilder AddMakerverseSchema(this IRequestExecutorBuilder builder) =>
      builder.AddQueryType(d => d.Name("Query"))
             .AddSettingsSchema();
  }
}
