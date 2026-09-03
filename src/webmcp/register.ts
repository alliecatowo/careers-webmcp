/**
 * Registers all careers WebMCP tools on a `document.modelContext`.
 *
 * Tools are registered ONCE per ModelContext instance (module-level WeakSet
 * guard) so React StrictMode's double-mount in dev doesn't double-register.
 * Register once; tools read live state at invocation time (BUILD_CONTRACT
 * #14 — no dynamic re-registration based on route/login/etc).
 */
import { tools, type CareersTool } from './tools';
import { instrumentAll } from './presence';

const registered = new WeakSet<object>();

/**
 * Tools as actually registered: each one wrapped so the page can show a
 * transient echo of agent activity. The wrapper is additive and never changes
 * a tool's result (see ./presence/instrument.ts).
 */
const registrableTools: CareersTool[] = instrumentAll(tools);

export function getToolDefinitions(): CareersTool[] {
  return registrableTools;
}

export async function registerCareersTools(mc: WebMCP.ModelContext, opts?: { signal?: AbortSignal }): Promise<void> {
  if (!mc || registered.has(mc)) return;
  if (opts?.signal?.aborted) return;
  registered.add(mc);
  // When the registering component unmounts (or StrictMode's dev-only
  // mount/unmount/mount cycle runs), the abort removes the tools from the
  // ModelContext, so release the guard to allow a clean re-registration.
  opts?.signal?.addEventListener('abort', () => registered.delete(mc), { once: true });
  for (const tool of registrableTools) {
    await mc.registerTool(
      {
        name: tool.name,
        title: tool.title,
        description: tool.description,
        inputSchema: tool.inputSchema,
        annotations: tool.annotations,
        execute: tool.execute as WebMCP.ToolExecuteCallback,
      },
      opts?.signal ? { signal: opts.signal } : undefined,
    );
  }
}
