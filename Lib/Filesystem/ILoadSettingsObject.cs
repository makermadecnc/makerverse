using Newtonsoft.Json.Linq;

namespace Makerverse.Api.Settings.Models {
  public interface ILoadSettingsObject {
    void LoadSettings(JObject obj);
  }
}
