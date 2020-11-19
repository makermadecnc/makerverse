using System;
using System.Collections.Generic;
using Makerverse.Api.UserSettings;
using Makerverse.Api.UserSettings.ConfigObjects;
using Microsoft.AspNetCore.Mvc;

namespace Makerverse.Api.Controllers {
  public class WorkspacesController : ApiControllerBase {
    [HttpGet]
    public IActionResult List() {
      return new JsonResult(new List<WorkspaceConfig>(Config.Data.Workspaces));
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

    [HttpPost("{id}")]
    public IActionResult Run(string id) {
      throw new NotImplementedException();
    }

    public WorkspacesController(ConfigFile config) : base(config) { }
  }
}
