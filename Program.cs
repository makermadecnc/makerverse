
using System;
using System.Linq;
using ElectronNET.API;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Serilog;

namespace Makerverse {
  public class Program {
    private const string ProductionEnv = "Production";
    private static string[] Environments = new[] { "Development", ProductionEnv };

    public static void Main(string[] args) {
      string env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? ProductionEnv;
      env = Environments.Contains(env) ? env : ProductionEnv;
      LoadSerilog($"appsettings.{env}.json");
      CreateHostBuilder(args).Build().Run();
    }

    public static ILogger LoadSerilog(string filename) => Log.Logger =
      new LoggerConfiguration()
       .ReadFrom.Configuration(new ConfigurationBuilder().AddJsonFile(filename).Build())
       .CreateLogger();

    public static IHostBuilder CreateHostBuilder(string[] args) =>
      Host.CreateDefaultBuilder(args)
          .ConfigureWebHostDefaults(webBuilder => {
             webBuilder.UseUrls("http://*:8000");
             webBuilder.UseElectron(args);
             webBuilder.UseSerilog();
             webBuilder.UseStartup<Startup>();
           });
  }
}
