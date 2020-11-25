using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using Makerverse.Api.Settings.Models;
using Serilog;

namespace Makerverse.Api.Identity.Services {
  // Global singleton DI class for in-memory session management.
  public class SessionManager {
    public ILogger Log { get; }

    public ConcurrentDictionary<string, MakerverseSession> Sessions { get; } = new ();

    public MakerverseSession LoadSession(string token, MakerverseUser user, params string[] roles) {
      MakerverseSession session = Sessions.GetOrAdd(token, (t) => {
        Log.Debug("Creating new session for {username}", user.Username);
        return new MakerverseSession() {Token = t, User = user, Roles = roles};
      });
      if (!session.User.Username.Equals(user.Username)) {
        Log.Error("Token {token} is for {username}, not {requested}", token, session.User.Username, user.Username);
        throw new ArgumentException("Token mismatch: invalid user.");
      }
      // New roles always take priority.
      session.Roles = roles;
      return session;
    }

    public SessionManager(ILogger logger) {
      Log = logger.ForContext("Context", nameof(SessionManager));
    }
  }
}
