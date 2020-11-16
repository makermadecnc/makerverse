using Microsoft.AspNetCore.Mvc;
using Serilog;

namespace Makerverse.Api.Controllers {
  public class UsersController : ApiControllerBase {

    [HttpPost("login")]
    [HttpGet("login")]
    public IActionResult Login() {
      Log.Information("LOGIN!");
      return Ok("{}");
    }

    public UsersController(ILogger logger) : base(logger) { }
  }
}
