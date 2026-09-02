# WebMCP imperative API (verified 2026-09-02 from `webmcp-types@0.1.5` + explainer)

```ts
declare namespace WebMCP {
  interface ToolExecuteCallbackOptions { signal: AbortSignal }
  type ToolExecuteCallback<T = Record<string, unknown>> =
    (inputObject: T, options: ToolExecuteCallbackOptions) => unknown | Promise<unknown>;
  interface ToolAnnotations { readOnlyHint?: boolean; untrustedContentHint?: boolean }
  interface ModelContextTool {
    name: string; title?: string; description: string;
    inputSchema?: object;                 // JSON Schema
    execute: ToolExecuteCallback;
    annotations?: ToolAnnotations;
  }
  interface ModelContextRegisterToolOptions { signal?: AbortSignal; exposedTo?: string[] }
  interface ModelContext extends EventTarget {
    registerTool(tool: ModelContextTool, options?: ModelContextRegisterToolOptions): Promise<void>;
    getTools(options?): Promise<RegisteredTool[]>;
    ontoolchange: ...;   // fired by the browser when the registered tool set changes; NOT for app events
  }
}
interface Document { readonly modelContext?: WebMCP.ModelContext }
```

Rules we follow:

- Feature-detect `typeof document !== "undefined" && document.modelContext`.
- Register ONCE per page load; unregister only via the `signal` option (page teardown).
- `execute` returns `{ content: [{ type: "text", text: JSON.stringify(result) }] }`
  (the MCP CallToolResult shape shown in the explainer). Errors are returned the same
  way with `isError: true` and a structured `{ error, message }` JSON body.
- Annotations: only `readOnlyHint` and `untrustedContentHint` exist in the current types.
