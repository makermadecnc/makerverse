using System;
using System.Collections.Generic;
using System.Linq;
using HotChocolate;
using HotChocolate.Configuration;
using HotChocolate.Types.Descriptors;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using OpenWorkEngine.OpenController.Machines.Models;
using Serilog;

namespace Makerverse.Api {
  public class SchemaSplitterInterceptor : ISchemaInterceptor {
    private static readonly Dictionary<string, string> ClassNameToModuleMap = new Dictionary<string, string>() {
      [nameof(ControlledMachine)] = "",
    };

    public void OnBeforeCreate(IDescriptorContext context, ISchemaBuilder schemaBuilder) { }

    public void OnAfterCreate(IDescriptorContext context, ISchema schema) {
      IHttpContextAccessor? httpAccessor = context.Services.GetService<IHttpContextAccessor>();
      IHeaderDictionary? headers = httpAccessor?.HttpContext?.Request.Headers;
      string? schemaContext = headers?["User-Agent"];
      string? module = headers?["Module"];

      Log.Debug("[SCHEMA] created {schemaContext}#{module} with types: {@types}",
        schemaContext, module, schema.Types.Select(t => t.Name.Value));
    }

    public void OnError(IDescriptorContext context, Exception exception) {
      Log.Error(exception, "[SCHEMA] split failed");
    }
  }
}
