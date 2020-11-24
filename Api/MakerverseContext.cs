using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using Makerverse.Api.Settings.Models;
using Makerverse.Lib;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;

namespace Makerverse.Api {
  public class MakerverseContext {
    public MakerverseSettings Settings { get; }

    public IWebHostEnvironment WebHostEnvironment { get; }

    public string? Subdomain { get; }

    public string OwsHost { get; }

    private List<MakerverseUser>? _enabledUsers;

    public List<MakerverseUser> enabledUsers => _enabledUsers ??=
      (Settings?.Users.Where(u => u.Enabled).ToList() ?? new List<MakerverseUser>());

    private readonly ConfigFile _configFile;

    public void SaveSettings() => _configFile.Save();

    public MakerverseContext(IWebHostEnvironment env, ConfigFile cf) {
      WebHostEnvironment = env;
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
