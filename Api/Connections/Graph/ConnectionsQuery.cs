using System;
using System.IO.Ports;
using System.Linq;
using HotChocolate.AspNetCore.Authorization;
using HotChocolate.Types;
using Makerverse.Api.Connections.Models;

namespace Makerverse.Api.Connections.Graph {
  [ExtendObjectType(Name = "Query")]
  public class ConnectionsQuery {
    public ConnectionPort[] ListPorts() => SerialPort.GetPortNames()
                                                     .Select(n => new ConnectionPort() {Name = n})
                                                     .ToArray();
  }
}
