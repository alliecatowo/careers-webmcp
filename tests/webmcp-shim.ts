/**
 * TEST-ONLY WebMCP shim. Never imported by application code.
 *
 * `createModelContextShim()` gives unit tests an in-process fake of
 * `document.modelContext` implementing the imperative registerTool/getTools
 * API. `installShim()` attaches it to a real `document` (jsdom or a real
 * browser document is fine) for provider-level tests.
 *
 * `serializeShimForBrowser()` returns the SAME behavior as a self-contained
 * plain-JS string with no imports, for Playwright's `page.addInitScript`.
 */
export interface RecordedCall {
  name: string;
  input: Record<string, unknown>;
  result: unknown;
}

export interface ModelContextShim extends EventTarget {
  registerTool: (tool: WebMCP.ModelContextTool, opts?: WebMCP.ModelContextRegisterToolOptions) => Promise<void>;
  getTools: () => Promise<WebMCP.ModelContextTool[]>;
  callTool: (name: string, input?: Record<string, unknown>, opts?: { signal?: AbortSignal }) => Promise<unknown>;
  calls: RecordedCall[];
}

export function createModelContextShim(): ModelContextShim {
  const target = new EventTarget();
  const toolsByName = new Map<string, WebMCP.ModelContextTool>();
  const calls: RecordedCall[] = [];

  function dispatchChange() {
    target.dispatchEvent(new Event('toolchange'));
  }

  const shim: ModelContextShim = Object.assign(target, {
    calls,
    async registerTool(tool: WebMCP.ModelContextTool, opts?: WebMCP.ModelContextRegisterToolOptions) {
      toolsByName.set(tool.name, tool);
      dispatchChange();
      if (opts?.signal) {
        if (opts.signal.aborted) {
          toolsByName.delete(tool.name);
          dispatchChange();
        } else {
          opts.signal.addEventListener('abort', () => {
            toolsByName.delete(tool.name);
            dispatchChange();
          });
        }
      }
    },
    async getTools() {
      return Array.from(toolsByName.values());
    },
    async callTool(name: string, input: Record<string, unknown> = {}, opts?: { signal?: AbortSignal }) {
      const tool = toolsByName.get(name);
      if (!tool) throw new Error(`Unknown tool "${name}"`);
      const controller = opts?.signal ? undefined : new AbortController();
      const signal = opts?.signal ?? controller!.signal;
      const result = await tool.execute(input, { signal });
      calls.push({ name, input, result });
      return result;
    },
  });

  return shim;
}

/** Attach a fresh shim to `doc.modelContext` (configurable so tests can reset it). */
export function installShim(doc: Document = document): ModelContextShim {
  const shim = createModelContextShim();
  Object.defineProperty(doc, 'modelContext', {
    value: shim,
    configurable: true,
    writable: true,
  });
  return shim;
}

/**
 * Self-contained plain JS (no imports, no TypeScript) for Playwright's
 * `page.addInitScript(serializeShimForBrowser())`. Defines `document.modelContext`
 * and a convenience `window.__webmcp = { tools, call }` for specs to drive.
 */
export function serializeShimForBrowser(): string {
  return `
(function () {
  var toolsByName = new Map();
  var calls = [];
  var target = new EventTarget();

  function dispatchChange() {
    target.dispatchEvent(new Event('toolchange'));
  }

  var modelContext = Object.assign(target, {
    calls: calls,
    registerTool: function (tool, opts) {
      toolsByName.set(tool.name, tool);
      dispatchChange();
      if (opts && opts.signal) {
        if (opts.signal.aborted) {
          toolsByName.delete(tool.name);
          dispatchChange();
        } else {
          opts.signal.addEventListener('abort', function () {
            toolsByName.delete(tool.name);
            dispatchChange();
          });
        }
      }
      return Promise.resolve();
    },
    getTools: function () {
      return Promise.resolve(Array.from(toolsByName.values()));
    },
  });

  Object.defineProperty(document, 'modelContext', {
    value: modelContext,
    configurable: true,
    writable: true,
  });

  window.__webmcp = {
    tools: function () {
      return Array.from(toolsByName.keys());
    },
    call: function (name, input) {
      var tool = toolsByName.get(name);
      if (!tool) return Promise.reject(new Error('Unknown tool "' + name + '"'));
      var controller = new AbortController();
      return Promise.resolve(tool.execute(input || {}, { signal: controller.signal })).then(function (result) {
        calls.push({ name: name, input: input, result: result });
        var text = result && result.content && result.content[0] && result.content[0].text;
        return text ? JSON.parse(text) : result;
      });
    },
  };
})();
`;
}
