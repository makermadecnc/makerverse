using System;
using Makerverse.Api.UserSettings;
using Microsoft.AspNetCore.Mvc;

namespace Makerverse.Api.Controllers {
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
