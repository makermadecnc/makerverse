using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using System.Net.Sockets;
using System.Security.Authentication;
using System.Threading.Tasks;
using HotChocolate;
using HotChocolate.Language;
using HotChocolate.Types;
using HotChocolate.Utilities;
using Makerverse.Api.Settings.Models;
using Microsoft.AspNetCore.Hosting;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Serilog;

namespace Makerverse.Api.Identity.Graphql {
  [ExtendObjectType(Name = "Query")]
  public class IdentityQuery {

    public async Task<MakerverseUser> Authenticate([Service] MakerverseContext context, string token) {
      Log.Information("Handing off token to {host}", context.OwsHost);

      HttpClient client = context.LoadOwsClient(token);
      MakerverseUser? previouslyAuthenticatedUser = context.enabledUsers.FirstOrDefault(u => u.Tokens.Contains(token));
      HttpResponseMessage? res = null;

      try {
        res = await client.GetAsync("/api/users/me");
      } catch (HttpRequestException ex) {
        if (previouslyAuthenticatedUser != null) {
          return ValidateAccess(context, previouslyAuthenticatedUser, token);
        }
        Log.Error(ex, "Cannot connect.");
      } catch (Exception e) {
        Log.Error(e, "Unknown exception.");
      }
      if (res == null) {
        throw new UnauthorizedAccessException($"Gatekeeper unreachable");
      }
      string body = await res.Content.ReadAsStringAsync();
      if (res.StatusCode != HttpStatusCode.OK) {
        Log.Error("Invalid token handoff: {statusCode} {body}}", res.StatusCode, body);
        throw new UnauthorizedAccessException($"Gatekeeper status code: {res.StatusCode}");
      }
      JObject response = JsonConvert.DeserializeObject<JObject>(body);
      if (response.ContainsKey("errors") && response["errors"] is JArray errs && errs.FirstOrDefault() is JObject err) {
        Log.Error("Error from gatekeeper: {error}", err);
        throw new UnauthorizedAccessException($"Gatekeeper error code.");
      }
      if (!response.ContainsKey("data")) {
        Log.Error("No data in body: {body}}", res.StatusCode, body);
        throw new UnauthorizedAccessException($"Gatekeeper missing data.");
      }

      MakerverseUser user = new ();
      JsonConvert.PopulateObject(JsonConvert.SerializeObject(response["data"]), user);
      Log.Information("Response user: {user}", user);

      return ValidateAccess(context, user, token);
    }

    private MakerverseUser ValidateAccess(MakerverseContext context, MakerverseUser user, string token) {
      if (context.enabledUsers.Count < 1) {
        // First user. Automatically add as a user.
        context.enabledUsers.Push(user);
      } else {
        MakerverseUser? existingUser = context.enabledUsers.FirstOrDefault(
          u => u.Username.EqualsInvariantIgnoreCase(user.Username));
        if (existingUser == null) {
          throw new UnauthorizedAccessException(
            $"{user.Username} does not have access to this installation. " +
            $"{context.enabledUsers.First().Username} must grant them access.");
        }
      }

      if (!user.Tokens.Contains(token)) {
        user.Tokens.Push(token);
      }
      int excess = user.Tokens.Count - 20;
      if (excess > 0) {
        user.Tokens.RemoveRange(0, excess);
      }

      context.SaveSettings();
      return user;
    }
  }
}
