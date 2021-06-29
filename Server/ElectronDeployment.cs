using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;

#if BUILD_ELECTRON
using ElectronNet.API;
#endif

namespace Makerverse {
  public static class ElectronDeployment {
    public static void ConfigureElectronDeployment(this IWebHostBuilder webBuilder, string[] args) {
#if BUILD_ELECTRON
      webBuilder.UseElectron(args);
#endif
    }

    public static void AddElectronDeployment(this IServiceCollection services) {
#if BUILD_ELECTRON
      services.AddElectron();
#endif
    }

    public static void StartElectronDeployment(this IApplicationBuilder app, IWebHostEnvironment env) {
#if BUILD_ELECTRON
      WebPreferences wp = new WebPreferences();
      wp.NodeIntegration = false;
      BrowserWindowOptions browserWindowOptions = new BrowserWindowOptions {
        WebPreferences = wp
      };
      Task.Run(async () => await Electron.WindowManager.CreateWindowAsync(browserWindowOptions));
#endif
    }
  }
}
