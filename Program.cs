using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using OpenWorkShop.MakerHub;
using Serilog;

namespace Makerverse {
  public class Program {
    public static void Main(string[] args) {
      MakerHubDeployment.Singleton.Initialize();
      CreateHostBuilder(args).Build().Run();
    }

    public static IHostBuilder CreateHostBuilder(string[] args) =>
      Host.CreateDefaultBuilder(args)
          .ConfigureWebHostDefaults(webBuilder => {
             webBuilder.UseUrls("http://*:" + MakerHubDeployment.Singleton.Port);
             webBuilder.ConfigureElectronDeployment(args);
             webBuilder.UseSerilog();
             webBuilder.UseStartup<Startup>();
           });
  }
}