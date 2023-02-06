using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using OpenWorkShop.MakerHub;
using Serilog;

namespace Makerverse {
  public class Program {
    public static void Main(string[] args) {
      MakerHubDeployment.Singleton.Initialize((c) => c);

      using (IHost host = CreateHostBuilder(args).Build()) {
        host.Run();
      }
    }

    public static IHostBuilder CreateHostBuilder(string[] args) =>
      Host.CreateDefaultBuilder(args)
          .ConfigureWebHostDefaults(webBuilder => {
             Log.Information("WH: {host}", MakerHubDeployment.Singleton.Env.AppEnvironment.ToString());
             MakerHubDeployment.Singleton.ConfigureWebHost(webBuilder);
             webBuilder.UseStartup<Startup>();
           });
  }
}
