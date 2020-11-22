using HotChocolate;

namespace Makerverse.Lib {
  public class GraphqlErrorFilter : IErrorFilter {
    public IError OnError(IError error) {
      Serilog.Log.ForContext("Context", "GraphQL").Error(error.Exception, "{error}", error);
      return error;
    }
  }
}
