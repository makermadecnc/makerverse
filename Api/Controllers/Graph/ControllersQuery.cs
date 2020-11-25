using System.IO.Ports;
using System.Linq;
using HotChocolate;
using HotChocolate.Types;
using Makerverse.Lib.Graphql;
using OpenWorkEngine.OpenController.Controller;
using OpenWorkEngine.OpenController.Controller.Models;

namespace Makerverse.Api.Controllers.Graph {
  [ExtendObjectType(Name = "Query")]
  public class ControllersQuery {
    [AuthorizeMakerverseUser]
    public SystemPort[] ListPorts([Service] MakerverseContext context) => context.Ports.Map.Values.ToArray();

    [AuthorizeMakerverseUser]
    public SystemPort Port([Service] MakerverseContext context, string portName) => context.Ports.Map[portName];
  }
}
