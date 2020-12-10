using Microsoft.AspNetCore.Mvc;
using Serilog;

namespace Makerverse.Lib {
  [ApiController]
  [ApiRoute("[controller]")]
  [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
  public abstract class ApiControllerBase : ControllerBase {
    public ILogger Log { get; }

    public ConfigFile Config { get; }

    public ApiControllerBase(ConfigFile config) {
      Config = config;
      Log = config.Log.ForContext("ApiController", GetType().Name);
    }
  }
}
