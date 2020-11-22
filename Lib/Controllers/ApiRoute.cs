using Microsoft.AspNetCore.Mvc;

namespace Makerverse.Lib {
  public class ApiRouteAttribute : RouteAttribute {
    public ApiRouteAttribute(string template) : base($"api/{template}") { }
  }
}
