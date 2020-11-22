using System;
using Makerverse.Lib;
using Microsoft.AspNetCore.Mvc;

namespace Makerverse.Api.Settings.Controllers {
  public class GcodeController : ApiControllerBase {

    [HttpGet]
    public IActionResult List() {
      throw new NotImplementedException();
    }

    [HttpPost]
    public IActionResult Create() {
      throw new NotImplementedException();
    }

    [HttpGet("{id}")]
    public IActionResult Read(string id) {
      throw new NotImplementedException();
    }

    public GcodeController(ConfigFile config) : base(config) { }
  }
}
