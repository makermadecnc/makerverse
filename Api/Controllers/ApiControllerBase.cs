using Microsoft.AspNetCore.Mvc;
using Serilog;

namespace Makerverse.Api.Controllers {
  [ApiController]
  [ApiRoute("[controller]")]
  [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
  public abstract class ApiControllerBase : ControllerBase {
    private ILogger Log { get; }

    public ApiControllerBase(ILogger logger) {
      Log = logger.ForContext("Api", GetType().Name);
    }
  }
}
