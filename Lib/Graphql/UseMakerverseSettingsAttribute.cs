using System.Reflection;
using HotChocolate.Types;
using HotChocolate.Types.Descriptors;
using Makerverse.Api.Settings;
using Makerverse.Api.Settings.Models;

namespace Makerverse.Lib {
  public class UseMakerverseSettingsAttribute : ObjectFieldDescriptorAttribute {
    public override void OnConfigure(
      IDescriptorContext context,
      IObjectFieldDescriptor descriptor,
      MemberInfo member)
    {
      descriptor.Use<MakerverseSettings>();
    }
  }
}
