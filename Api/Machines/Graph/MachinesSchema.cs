using HotChocolate.Execution.Configuration;
using Makerverse.Api.Machines.Models;
using Makerverse.Api.Settings.Graph;
using Makerverse.Lib;
using Makerverse.Lib.Graphql;
using Microsoft.Extensions.DependencyInjection;

namespace Makerverse.Api.Machines.Graph {
  public static class MachinesSchema {
    [UseMakerverseSettings]
    public static IRequestExecutorBuilder AddMachinesSchema(this IRequestExecutorBuilder builder) =>
      builder
       .AddType<MachineFirmwareSettingsType>();
  }
}
