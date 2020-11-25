using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using Makerverse.Api.Identity.Services;
using Makerverse.Api.Settings.Models;
using Makerverse.Lib;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using OpenWorkEngine.OpenController.Controller;
using OpenWorkEngine.OpenController.Controller.Services;
using Serilog;

namespace Makerverse.Api {
  public class MakerverseContext {
    public MakerverseSettings Settings { get; }

    public IWebHostEnvironment WebHostEnvironment { get; }

    public SessionManager Sessions { get; }

    public PortManager Ports { get; }

    public string? Subdomain { get; }

    public string OwsHost { get; }

    public ILogger Log { get; }

    private List<MakerverseUser>? _enabledUsers;

    public List<MakerverseUser> enabledUsers => _enabledUsers ??=
      (Settings?.Users.Where(u => u.Enabled).ToList() ?? new List<MakerverseUser>());

    private readonly ConfigFile _configFile;

    public void SaveSettings() => _configFile.Save();

    public MakerverseContext(IWebHostEnvironment env, ConfigFile cf, SessionManager sm, PortManager p) {
      Sessions = sm;
      Ports = p;
      WebHostEnvironment = env;
      Log = cf.Log.ForContext("WebHost", env.WebRootPath);
      _configFile = cf;
      Settings = _configFile.Data ?? new MakerverseSettings();
      if (env.IsDevelopment()) {
        Subdomain = "dev";
        OwsHost = "http://dev.openwork.shop:5000";
      } else if (env.IsStaging()) {
        Subdomain = "staging";
        OwsHost = "https://staging.openwork.shop";
      } else {
        OwsHost = "https://openwork.shop";
      }
    }

    public HttpClient LoadOwsClient(string token) {
      HttpClient client = new HttpClient();
      client.BaseAddress = new Uri(OwsHost);
      client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
      client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
      return client;
    }
  }
}
