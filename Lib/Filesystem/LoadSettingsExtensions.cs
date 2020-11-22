using System;
using System.Collections.Generic;
using System.Linq;
using Makerverse.Api.Settings.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Serilog;

namespace Makerverse.Lib.Filesystem {
  public static class LoadSettingsExtensions {
    public static List<TSetting> LoadArray<TSetting>(JObject obj, string key)
      where TSetting : ILoadSettingsObject, new()
    {
      if (!(obj[key] is JArray arr)) return new List<TSetting>();
      return arr.Select(jt => jt as JObject).Where(jo => jo != null).Select(jo => {
        TSetting s = new ();
        s.LoadSettings(jo!);
        return s;
      }).ToList();
    }

    public static Dictionary<string, TSetting> LoadDictionary<TSetting>(
      JObject obj, string key, Func<string, JToken?, TSetting>? builder = null
    ) where TSetting : ILoadSettingsObject, new() {
      Dictionary<string, TSetting> ret = new();
      if (!(obj[key] is JObject o)) return ret;
      if (builder == null) builder = (k, v) => Build<TSetting>(v);
      foreach (KeyValuePair<string, JToken?> kvp in o) {
        try {
          ret.Add(kvp.Key, builder(kvp.Key, kvp.Value));
        } catch (Exception e) {
          Log.Error(e, "Failed to load dictionary {key} from {object}", kvp.Key,
            JsonConvert.SerializeObject(kvp.Value, Formatting.Indented));
        }
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
