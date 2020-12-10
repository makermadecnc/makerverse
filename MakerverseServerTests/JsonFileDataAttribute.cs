using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Xunit.Sdk;

namespace MakerverseServerTests {
  public class JsonFileDataAttribute : DataAttribute {
    private readonly string[] _filePaths;

    public JsonFileDataAttribute(params string[] filePaths) {
      _filePaths = filePaths;
    }

    public override IEnumerable<object[]> GetData(MethodInfo testMethod) {
      if (testMethod == null) { throw new ArgumentNullException(nameof(testMethod)); }

      return _filePaths.Select(fp => {
        string path = $"files/{fp}";

        if (!File.Exists(path)) {
          throw new ArgumentException($"Could not find file at path: {path}");
        }

        string fileData = File.ReadAllText(path);
        object obj = JsonConvert.DeserializeObject<JObject>(fileData) as object;
        return new object[] {obj};
      });
      // Get the absolute path to the JSON file
    }
  }
}
