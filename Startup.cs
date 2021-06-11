﻿using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using OpenWorkShop.MakerHub;
using OpenWorkShop.MakerHub.Identity.Services;
using OpenWorkShop.MakerHub.Lib.Api;
using Serilog;

namespace Makerverse {
  public class Startup {
    private static readonly ILogger Log = Serilog.Log.ForContext(typeof(Startup));

    // This method gets called by the runtime. Use this method to add services to the container.
    // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
    public void ConfigureServices(IServiceCollection services) {
      services.AddElectronDeployment();
      services.AddSpaStaticFiles(configuration => {
        configuration.RootPath = "WebApp/build";
      });
      services.AddMakerHubServices();
      services.AddAuthentication();
      services.AddAuthorization(opts => {
        opts.AddMakerHubPolicies();
      });
      services.AddMakerHubServer();
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env) {
      // ConfigFile? sf = app.ApplicationServices.GetService<ConfigFile>();
      // Log.Information("[CONFIG] load filename: {sf}", sf);

      app.UseExceptionHandler(new ExceptionHandlerOptions {
        ExceptionHandler = ApiExceptionMiddleware.Invoke
      });

      app.UseAuthentication();
      app.UseRouting();
      app.UseSerilogRequestLogging();
      app.UseWebSockets(new WebSocketOptions() { // "Must appear before UseEndpoints"
        AllowedOrigins = {"*"}
      });
      app.UseStaticFiles();
      app.UseSpaStaticFiles();
      app.UseEndpoints(endpoints => {
        endpoints.MapGraphQL(MakerHubDeployment.Singleton.GraphqlPath);
      });
      app.UseSpa(spa => {
        spa.Options.SourcePath = "WebApp";
        if (env.IsDevelopment()) spa.UseProxyToSpaDevelopmentServer("http://localhost:3000");
      });

      app.StartElectronDeployment(env);
    }
  }
}
