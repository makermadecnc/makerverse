
using ElectronNET.API;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Serilog;

namespace Makerverse {
  public class Program {
    public static void Main(string[] args) {
      Log.Logger = new LoggerConfiguration()
                  .ReadFrom.Configuration(new ConfigurationBuilder().AddJsonFile("appsettings.json").Build())
                  .CreateLogger();
      CreateHostBuilder(args).Build().Run();
    }

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
