using Serilog;
using Xunit.Abstractions;

namespace MakerverseServerTests {
  public abstract class TestBase {
    public TestBase(ITestOutputHelper output) {
      Log.Logger = new LoggerConfiguration()
                  .MinimumLevel.Debug()
                  .WriteTo.TestOutput(output)
                  .CreateLogger();
    }
  }
}
