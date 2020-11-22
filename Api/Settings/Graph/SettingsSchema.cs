using HotChocolate.Execution.Configuration;
using Makerverse.Api.Settings.Models;
using Makerverse.Lib;
using Microsoft.Extensions.DependencyInjection;

namespace Makerverse.Api.Settings.Graph {
  public static class SettingsSchema {
    [UseMakerverseSettings]
    public static IRequestExecutorBuilder AddSettingsSchema(this IRequestExecutorBuilder builder) =>
      builder
       .AddType<SettingsQuery>();
  }
}
