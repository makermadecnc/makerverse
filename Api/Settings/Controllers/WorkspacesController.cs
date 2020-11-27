using System;
using System.Collections.Generic;
using System.Linq;
using Makerverse.Api.Settings.Models;
using Makerverse.Api.Workspaces.Models;
using Makerverse.Lib;
using Microsoft.AspNetCore.Mvc;

namespace Makerverse.Api.Settings.Controllers {
  public class WorkspacesController : ApiControllerBase {
    [HttpGet]
    public IActionResult List() {
      List<WorkspaceSettings> workspaces = Config.Data?.Workspaces.ToList() ?? new List<WorkspaceSettings>();
      return new JsonResult(workspaces);
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
