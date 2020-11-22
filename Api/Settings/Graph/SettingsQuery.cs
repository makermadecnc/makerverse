using System.Linq;
using HotChocolate;
using HotChocolate.Types;
using Makerverse.Api.Settings.Models;
using Makerverse.Lib;

namespace Makerverse.Api.Settings.Graph {
  [ExtendObjectType(Name = "Query")]
  public class SettingsQuery {
    public MakerverseSettings? Settings([Service] ConfigFile file) => file.Data;
  }
}
