using Microsoft.AspNetCore.Mvc;

namespace Makerverse.Api.Controllers {
  public class ApiRouteAttribute : RouteAttribute {
    public ApiRouteAttribute(string template) : base($"api/{template}") { }
  }
}
