using System;
using System.Collections.Generic;
using System.Linq;
using Makerverse.Api.Settings.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using OpenWorkEngine.OpenController.Lib;
using Serilog;

namespace Makerverse.Lib.Filesystem {
  public static class LoadSettingsExtensions {
    public static List<TSetting> LoadArray<TSetting>(JObject obj, string key)
      where TSetting : ILoadSettingsObject, new()
    {
      if (!(obj[key] is JArray arr)) return new List<TSetting>();

      List<TSetting> ret = new();
      foreach (JToken t in arr) {
        try {
          ret.Add(Build<TSetting>(t));
        } catch (Exception e) {
          Log.Error(e, "Failed to load array item {object}",
            JsonConvert.SerializeObject(t, Formatting.Indented));
        }
      }
      return ret;
    }

    public static List<TSetting> LoadDictionary<TSetting>(
      JObject obj, string key, Func<string?, JToken?, TSetting>? builder = null
    ) where TSetting : ILoadSettingsObject, new() {
      List<TSetting> ret = new();
      if (builder == null) builder = (k, v) => Build<TSetting>(v);

      if (obj[key] is JObject o) {
        // legacy story as a dictionary
        foreach (KeyValuePair<string, JToken?> kvp in o) {
          try {
            ret.Add(builder(kvp.Key, kvp.Value));
          } catch (Exception e) {
            Log.Error(e, "Failed to load dictionary {key} from {object}", kvp.Key,
              JsonConvert.SerializeObject(kvp.Value, Formatting.Indented));
          }
        }
      }
      if (obj[key] is JArray arr) {
        ret = LoadArray<TSetting>(obj, key);
      }

      return ret;
    }

    public static TSetting Build<TSetting>(JToken? obj) where TSetting : ILoadSettingsObject, new() {
      TSetting s = new ();
      if (obj is JObject o) {
        s.LoadSettings(o);
      } else {
        throw new ArgumentException("Invalid setting object");
      }
      return s;
    }

    public static void AssignScalarValue<TRet>(this ILoadSettingsObject o, JObject obj, string key, Action<TRet> assign) {
      if (!(obj[key] is JValue v)) return;
      try {
        TRet ret = v.Value<TRet>();
        assign(ret);
      } catch (Exception e) {
        Log.Error(e, "Failed to assign {key} on {object}", key, o);
      }
    }
  }
}
