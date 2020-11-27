using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Security.Principal;
using System.Threading.Tasks;
using HotChocolate.Language;
using HotChocolate.Utilities;
using Makerverse.Api.Settings.Models;
using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using OpenWorkEngine.OpenController.Lib;
using Serilog;

namespace Makerverse.Api.Identity.Services {
  public class IdentityService {
    private MakerverseContext Context { get; }

    public ILogger Log { get; }

    // Exchange a token for a standard AspNetCore identity object.
    public async Task<ClaimsPrincipal?> ClaimIdentity(string token) {
      try {
        MakerverseSession session = await Authenticate(token);
        return GetClaimsPrincipal(session);
      } catch (Exception e) {
        Log.Error(e, "Session validation failed.");
      }
      return null;
    }

    private ClaimsPrincipal GetClaimsPrincipal(MakerverseSession session) {
      Log.Debug("Identified user {username}", session.User.Username);
      ClaimsIdentity identity = new ();
      identity.AddClaim(new Claim(ClaimTypes.Name, session.User.Username));
      return new GenericPrincipal(identity, session.Roles);
    }

    // Given junt a token, return a user with access to this installation.
    public async Task<MakerverseSession> Authenticate(string token) {
      Log.Information("Handing off token to {host}", Context.OwsHost);

      HttpClient client = Context.LoadOwsClient(token);
      MakerverseUser? previouslyAuthenticatedUser = Context.enabledUsers.FirstOrDefault(u => u.Tokens.Contains(token));
      HttpResponseMessage? res = null;

      try {
        res = await client.GetAsync("/api/users/me");
      } catch (HttpRequestException ex) {
        if (previouslyAuthenticatedUser != null) {
          return ValidateAccess(previouslyAuthenticatedUser, token);
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

      string userStr = JsonConvert.SerializeObject(response["data"]);
      MakerverseUser user = JsonConvert.DeserializeObject<MakerverseUser>(userStr);
      Log.Information("Exchanged token for user: {json} -> {@user}", userStr, user);

      return ValidateAccess(user, token);
    }

    // Given any user object, make sure they can access the current install with the given token.
    private MakerverseSession ValidateAccess(MakerverseUser user, string token) {
      bool changed = false;
      if (Context.enabledUsers.Count < 1) {
        // First user. Automatically add as a user.
        Context.enabledUsers.Push(user);
        changed = true;
      } else {
        // Already have users. Check that this user is one of them.
        MakerverseUser? existingUser = Context.enabledUsers.FirstOrDefault(
          u => u.Username.EqualsInvariantIgnoreCase(user.Username));
        if (existingUser == null) {
          Log.Warning("User {username} is not in valid users: {usernames}",
            user.Username, Context.enabledUsers.Select(u => u.Username));
          throw new UnauthorizedAccessException(
            $"{user.Username} does not have access to this installation. " +
            $"{Context.enabledUsers.First().Username} must grant them access.");
        }
        user = existingUser;
      }

      Log.Debug("User {username} found in users: {usernames}",
        user.Username, Context.enabledUsers.Select(u => u.Username));
      if (!user.Tokens.Contains(token)) {
        user.Tokens.Push(token);
        changed = true;
      }
      int excess = user.Tokens.Count - 20;
      if (excess > 0) {
        user.Tokens.RemoveRange(0, excess);
        changed = true;
      }

      if (changed) {
        Context.SaveSettings();
      }

      return Context.Sessions.LoadSession(token, user, MakerverseRoles.User);
    }

    public IdentityService(MakerverseContext context) {
      Context = context;
      Log = Context.Log.ForContext("Service", "Identity");
    }
  }
}
