using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using HotChocolate;
using HotChocolate.Types;
using Makerverse.Lib.Graphql;
using OpenWorkEngine.OpenController.Controller;
using OpenWorkEngine.OpenController.Controller.Models;

namespace Makerverse.Api.Controllers.Graph {
  [ExtendObjectType(Name = "Subscription")]
  public class ControllersSubscription {
    [Subscribe]
    [Topic]
    [AuthorizeMakerverseUser]
    public Task<SystemPort> OnPortStateChanged(
      [EventMessage] string portName,
      [Service] MakerverseContext context)
    {
      context.Log.Information("Subscription port: {name}", portName);
      return Task.FromResult(context.Ports[portName]);
    }

    // [Subscribe(With = nameof(SubscribeToPortAsync))]
    // public PortStateMessage OnPortUpdated(
    //   [Service] MakerverseContext context,
    //   [ID(nameof(SystemPort))] string name,
    //   [EventMessage] string port,
    //   CancellationToken cancellationToken)
    // {
    //   context.Log.Information("Subscription port: {name}", name);
    //   return new PortStateMessage(port, true);
    // }
    //
    // public ValueTask<ISourceStream<SystemPort>> SubscribeToPortAsync(
    //   string name,
    //   [Service] MakerverseContext context,
    //   [Service] ITopicEventReceiver eventReceiver,
    //   CancellationToken cancellationToken
    // ) {
    //   context.Log.Information("Subscription port update: {name}", name);
    //   if (port == null) {
    //     throw new KeyNotFoundException(name);
    //   }
    //   return eventReceiver.SubscribeAsync<string, SystemPort>(name, cancellationToken);
    // }
  }
}
