using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ElectronNET.API;
using Makerverse.Api;
using Makerverse.Lib;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Headers;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Net.Http.Headers;
using OpenWorkEngine.OpenController.Hubs;
using OpenWorkEngine.OpenController.Lib.Api;
using Serilog;

namespace Makerverse {
  public class Startup {
    private const string GraphqlPath = "/api/graphql";

    // This method gets called by the runtime. Use this method to add services to the container.
    // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
    public void ConfigureServices(IServiceCollection services) {
      services.AddSignalR();
      services.AddSingleton(Log.Logger);
      services.AddSingleton<ConfigFile>();

      services.AddControllers();
      services.AddSpaStaticFiles(configuration => {
        configuration.RootPath = "App/build";
      });

      services.AddGraphQLServer()
              .AddMakerverseSchema()
              .AddErrorFilter<GraphqlErrorFilter>();
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env) {
      ConfigFile? sf = app.ApplicationServices.GetService<ConfigFile>();
      Log.Information("Config File: {sf}", sf);

      if (env.IsDevelopment()) {
        app.UseDeveloperExceptionPage();
      }
      app.UseExceptionHandler(new ExceptionHandlerOptions() {
        ExceptionHandler = new ApiExceptionMiddleware().Invoke
      });

      app.UseRouting();
      app.UseSerilogRequestLogging();

      // Static files come before routing
      app.UseStaticFiles();
      app.UseSpaStaticFiles(new StaticFileOptions() {
        OnPrepareResponse = (ctx) => {
          ResponseHeaders headers = ctx.Context.Response.GetTypedHeaders();
          headers.CacheControl = new CacheControlHeaderValue {
            Public = true,
            MaxAge = TimeSpan.FromDays(0)
          };
        }
      });

      app.UseEndpoints(endpoints => {
        endpoints.MapHub<ControllerHub>("/controllers");

        endpoints.MapControllerRoute(
          name: "default",
          pattern: "{controller}/{action=Index}/{id?}"
        );

        endpoints.MapGraphQL(GraphqlPath);
      });


      // App: www.openwork.shop
      app.UseSpa(spa => {
        spa.Options.SourcePath = "App";
        spa.Options.DefaultPageStaticFileOptions = new StaticFileOptions() {
          OnPrepareResponse = ctx => {
            ResponseHeaders headers = ctx.Context.Response.GetTypedHeaders();
            headers.CacheControl = new CacheControlHeaderValue {
              Public = true,
              MaxAge = TimeSpan.FromDays(0)
            };
          }
        };

        if (env.IsDevelopment()) {
          spa.UseProxyToSpaDevelopmentServer($"http://localhost:8001");
        }
      });

      Task.Run(async () => await Electron.WindowManager.CreateWindowAsync());
    }
  }
}
