using System;
using Makerverse.Api.UserSettings;
using Microsoft.AspNetCore.Mvc;

namespace Makerverse.Api.Controllers {
  public class VersionController : ApiControllerBase {
    [HttpGet]
    public IActionResult Get() {
      throw new NotImplementedException();
    }

    public VersionController(ConfigFile config) : base(config) { }
  }
}
