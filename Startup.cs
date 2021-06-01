using System;
using System.Threading.Tasks;
using ElectronNET.API;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Headers;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Net.Http.Headers;
using OpenWorkShop.MakerHub;
using OpenWorkShop.MakerHub.Identity.Services;
using OpenWorkShop.MakerHub.Lib.Api;
using OpenWorkShop.MakerHub.Lib.Filesystem;
using Serilog;

namespace Makerverse {
  public class Startup {
    private const string GraphqlPath = "/api/graphql";

    private static readonly ILogger Log = Serilog.Log.ForContext(typeof(Startup));

    // This method gets called by the runtime. Use this method to add services to the container.
    // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
    public void ConfigureServices(IServiceCollection services) {
      services.AddControllers();
      services.AddSpaStaticFiles(configuration => {
        configuration.RootPath = "App/build";
      });
      services.AddMakerHubServices();
      services.AddAuthentication();
      services.AddAuthorization(opts => {
        opts.AddMakerHubPolicies();
      });
      services.AddMakerHubGraphQLServer();
    }


    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env) {
      // ConfigFile? sf = app.ApplicationServices.GetService<ConfigFile>();
      // Log.Information("[CONFIG] load filename: {sf}", sf);

      app.UseExceptionHandler(new ExceptionHandlerOptions {
        ExceptionHandler = new ApiExceptionMiddleware().Invoke
      });

      app.UseAuthentication();
      app.UseRouting();
      app.UseSerilogRequestLogging();
      app.UseWebSockets();

      // Static files come before routing
      app.UseStaticFiles();
      app.UseSpaStaticFiles(new StaticFileOptions {
        OnPrepareResponse = ctx => {
          ResponseHeaders headers = ctx.Context.Response.GetTypedHeaders();
          headers.CacheControl = new CacheControlHeaderValue {
            Public = true,
            MaxAge = TimeSpan.FromDays(0)
          };
        }
      });

      app.UseEndpoints(endpoints => {
        endpoints.MapControllerRoute(
          "default",
          "{controller}/{action=Index}/{id?}"
        );

        endpoints.MapGraphQL(GraphqlPath);
      });

      // App: www.openwork.shop
      app.UseSpa(spa => {
        spa.Options.SourcePath = "App";
        spa.Options.DefaultPageStaticFileOptions = new StaticFileOptions {
          OnPrepareResponse = ctx => {
            ResponseHeaders headers = ctx.Context.Response.GetTypedHeaders();
            headers.CacheControl = new CacheControlHeaderValue {
              Public = true,
              MaxAge = TimeSpan.FromDays(0)
            };
          }
        };

        if (env.IsDevelopment()) spa.UseProxyToSpaDevelopmentServer("http://localhost:8001");
      });

      Task.Run(async () => await Electron.WindowManager.CreateWindowAsync());
    }
  }
}
