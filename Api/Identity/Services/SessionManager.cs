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
      MakerverseSession session = Sessions.AddOrUpdate(token, (s) => {
        MakerverseSession newSession = new MakerverseSession() {Token = s, User = user, Roles = roles};
        Log.Debug("[SESSION] create: {session}", newSession.ToString());
        return newSession;
      }, (s, existingSession) => {
        existingSession.Roles = roles;
        Log.Debug("[SESSION] update: {session}", existingSession.ToString());
        return existingSession;
      });
      // Sanity checks before return.
      if (!session.User.Username.Equals(user.Username)) {
        Log.Error("[SESSION] Token {token} is for {foundUser}, not {user}",
          token, session.User.ToString(), user.ToString());
        throw new ArgumentException("Token mismatch: invalid user.");
      }
      return session;
    }

    public SessionManager(ILogger logger) {
      Log = logger.ForContext(typeof(SessionManager));
    }
  }
}
