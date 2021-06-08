using System;
using System.Linq;
using ElectronNET.API;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Serilog;
using Serilog.Sinks.SystemConsole.Themes;

namespace Makerverse {
  public class Program {
    private const string ProductionEnv = "Production";
    private static readonly string[] Environments = {"Development", ProductionEnv};

    public static void Main(string[] args) {
      Log.Logger = new LoggerConfiguration()
                  .WriteTo.Console(theme: AnsiConsoleTheme.Code)
                  .CreateLogger();

      string env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? ProductionEnv;
      env = Environments.Contains(env) ? env : ProductionEnv;
      LoadSerilog($"appsettings.{env}.json");
      CreateHostBuilder(args).Build().Run();
    }

    public static ILogger LoadSerilog(string filename) => Log.Logger =
      new LoggerConfiguration()
       .ReadFrom.Configuration(new ConfigurationBuilder().AddJsonFile(filename).Build())
       .CreateLogger().ForContext("App", "MV");

    public static IHostBuilder CreateHostBuilder(string[] args) =>
      Host.CreateDefaultBuilder(args)
          .ConfigureWebHostDefaults(webBuilder => {
             webBuilder.UseUrls("http://*:" + BridgeSettings.WebPort);
             webBuilder.UseElectron(args);
             webBuilder.UseSerilog();
             webBuilder.UseStartup<Startup>();
           });
  }
}
