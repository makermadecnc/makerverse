using System;
using System.Collections.Generic;
using System.IO.Ports;
using System.Linq;
using System.Threading.Tasks;
using HotChocolate;
using HotChocolate.Subscriptions;
using HotChocolate.Types;
using Makerverse.Lib.Graphql;
using OpenWorkEngine.OpenController.Controller;
using OpenWorkEngine.OpenController.Controller.Messages;
using OpenWorkEngine.OpenController.Controller.Models;

namespace Makerverse.Api.Controllers.Graph {
  [ExtendObjectType(Name = "Mutation")]
  public class ControllersMutation {
    [AuthorizeMakerverseUser]
    public async Task<SystemPort> OpenPort(
      [Service] MakerverseContext context, [Service] ITopicEventSender sender, string portName, SerialPortOptions options
    ) {
      SystemPort port = context.Ports[portName];
      port.Open(options);

      await sender.SendAsync(
        nameof(ControllersSubscription.OnPortStateChanged),
        portName);

      return port;
    }
  }
}
