﻿using System;
using System.Security.Claims;
using System.Threading.Tasks;
using ElectronNET.API;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Headers;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Net.Http.Headers;
using OpenWorkEngine.OpenController;
using OpenWorkEngine.OpenController.Controllers;
using OpenWorkEngine.OpenController.Controllers.Services;
using OpenWorkEngine.OpenController.Identity.Services;
using OpenWorkEngine.OpenController.Lib.Api;
using OpenWorkEngine.OpenController.Lib.Filesystem;
using OpenWorkEngine.OpenController.Lib.Graphql;
using OpenWorkEngine.OpenController.Ports.Services;
using OpenWorkEngine.OpenController.Workspaces.Services;
using Serilog;

namespace Makerverse {
  public class Startup {
    private const string GraphqlPath = "/api/graphql";

    private static ILogger Log = Serilog.Log.ForContext(typeof(Startup));

    // This method gets called by the runtime. Use this method to add services to the container.
    // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
    public void ConfigureServices(IServiceCollection services) {
      services.AddSingleton(Serilog.Log.Logger);
      services.AddSingleton<ConfigFile>();
      services.AddSingleton<SessionManager>();
      services.AddSingleton<ControllerManager>();
      services.AddSingleton<WorkspaceManager>();
      services.AddTransient<OpenControllerContext>();
      services.AddScoped<IdentityService>();
      services.AddHttpContextAccessor();
      //
      // services.AddIdentity<MakerverseUser, MakerverseRole>()
      //         .AddUserStore<MakerverseUserStore>()
      //         .AddRoleStore<MakerverseRoleStore>()
      //         .AddTokenProvider<IdentityService>(TokenOptions.DefaultProvider);
      services.AddAuthentication(options => {
        // options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
      });
      services.AddAuthorization(opts => {
        opts.AddMakerversePolicies();
      });

      services.AddControllers();
      services.AddSpaStaticFiles(configuration => {
        configuration.RootPath = "App/build";
      });

      services.AddHttpResultSerializer<GraphqlHttpResultSerializer>()
              .AddInMemorySubscriptions()
              .AddGraphQLServer()
              .AddDiagnosticEventListener<GraphqlDiagnosticEventListener>()
              .AddSocketSessionInterceptor<MakerverseSocketSessionInterceptor>()
              .AddHttpRequestInterceptor<MakerverseHttpRequestInterceptor>()
              .AddAuthorization()
              .AddOpenControllerSchema()
              // .TryAddSchemaInterceptor<SchemaSplitterInterceptor>()
              .AddErrorFilter<GraphqlErrorFilter>();
    }


    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env) {
      ConfigFile? sf = app.ApplicationServices.GetService<ConfigFile>();
      Log.Information("[CONFIG] load filename: {sf}", sf);

      if (env.IsDevelopment()) {
        app.UseDeveloperExceptionPage();
      }
      app.UseExceptionHandler(new ExceptionHandlerOptions() {
        ExceptionHandler = new ApiExceptionMiddleware().Invoke
      });

      app.UseAuthentication();
      app.UseRouting();
      app.UseSerilogRequestLogging();
      app.UseWebSockets();

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
