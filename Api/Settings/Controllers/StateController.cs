using System;
using Makerverse.Lib;
using Microsoft.AspNetCore.Mvc;

namespace Makerverse.Api.Settings.Controllers {
  public class StateController : ApiControllerBase {
    [HttpGet]
    // Get the entire state object.
    public IActionResult Get() {
      throw new NotImplementedException();
    }

    [HttpDelete("{key}")]
    // Delete a key from the state object.
    public IActionResult Delete(string key) {
      throw new NotImplementedException();
    }

    [HttpPatch]
    // Update the state object with some new state.
    public IActionResult Update() {
      throw new NotImplementedException();
    }

    public StateController(ConfigFile config) : base(config) { }
  }
}
