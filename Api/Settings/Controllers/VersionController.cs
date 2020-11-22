using System;
using Makerverse.Lib;
using Microsoft.AspNetCore.Mvc;

namespace Makerverse.Api.Settings.Controllers {
  public class VersionController : ApiControllerBase {
    [HttpGet]
    public IActionResult Get() {
      throw new NotImplementedException();
    }

    public VersionController(ConfigFile config) : base(config) { }
  }
}
