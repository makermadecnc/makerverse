using System;
using Makerverse.Api.UserSettings;
using Microsoft.AspNetCore.Mvc;

namespace Makerverse.Api.Controllers {
  public class WatchController : ApiControllerBase {
    [HttpGet]
    public IActionResult List() {
      throw new NotImplementedException();
    }

    [HttpGet("{file}")]
    public IActionResult Read(string file) {
      throw new NotImplementedException();
    }

    public WatchController(ConfigFile config) : base(config) { }
  }
}
