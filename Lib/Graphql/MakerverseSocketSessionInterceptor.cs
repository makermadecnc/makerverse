using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using HotChocolate.AspNetCore;
using HotChocolate.AspNetCore.Subscriptions;
using HotChocolate.AspNetCore.Subscriptions.Messages;
using HotChocolate.Execution;
using Makerverse.Api.Identity.Services;
using Serilog;

namespace Makerverse.Lib.Graphql {
  public class MakerverseSocketSessionInterceptor : DefaultSocketSessionInterceptor {
    public override async ValueTask<ConnectionStatus> OnConnectAsync(
      ISocketConnection connection, InitializeConnectionMessage message, CancellationToken cancellationToken
    ) {
      if (message.Payload?["token"] is string token) {
        ClaimsPrincipal? principal = await connection.HttpContext.ClaimMakerverseIdentity(token);
        if (principal != null) {
          connection.HttpContext.User = principal;
        }
      }
      return await base.OnConnectAsync(connection, message, cancellationToken);
    }

    public override ValueTask OnRequestAsync(ISocketConnection connection, IQueryRequestBuilder requestBuilder, CancellationToken cancellationToken) {
      Log.Debug("[SOCKET] {connection} {query}", connection, requestBuilder);
      return base.OnRequestAsync(connection, requestBuilder, cancellationToken);
    }
  }
}
