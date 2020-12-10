using System;
using Makerverse.Lib;
using Microsoft.AspNetCore.Mvc;

namespace Makerverse.Api.Settings.Controllers {
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
