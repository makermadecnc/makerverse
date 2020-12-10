using System;
using System.Collections.Generic;
using Makerverse.Lib;
using Microsoft.AspNetCore.Mvc;
using Serilog;

namespace Makerverse.Api.Controllers {
  public class UsersController : ApiControllerBase {

    [HttpPost("login")]
    public IActionResult Login() {
      Log.Information("LOGIN!");
      object body = new {
        enabled = true,
        user = new {
          username = "zane"
        }
      };
      return new JsonResult(body);
    }

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

    [HttpDelete("{id}")]
    public IActionResult Delete(string id) {
      throw new NotImplementedException();
    }

    [HttpPatch("{id}")]
    public IActionResult Update(string id) {
      throw new NotImplementedException();
    }

    public UsersController(ConfigFile config) : base(config) { }
  }
}
