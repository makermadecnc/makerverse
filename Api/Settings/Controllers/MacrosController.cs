using System;
using Makerverse.Lib;
using Microsoft.AspNetCore.Mvc;

namespace Makerverse.Api.Settings.Controllers {
  public class MacrosController : ApiControllerBase {
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

    [HttpPatch("{id}")]
    public IActionResult Update(string id) {
      throw new NotImplementedException();
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(string id) {
      throw new NotImplementedException();
    }

    public MacrosController(ConfigFile config) : base(config) { }
  }
}
