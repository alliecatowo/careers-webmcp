import { describe, it, expect, vi, beforeEach } from 'vitest';
import { jobsModule, savedJobsModule, applicationsModule } from './fixtures';

vi.mock('@/domain/jobs', () => jobsModule);
vi.mock('@/domain/saved-jobs', () => savedJobsModule);
vi.mock('@/domain/applications', () => applicationsModule);

import { createModelContextShim } from '../../webmcp-shim';
import { registerCareersTools, getToolDefinitions } from '@/webmcp/register';
import { tools } from '@/webmcp/tools';

describe('webmcp tool registration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('registers exactly 18 tools with the exact stable names', async () => {
    const shim = createModelContextShim();
    await registerCareersTools(shim as unknown as WebMCP.ModelContext);
    const registered = await shim.getTools();
    expect(registered).toHaveLength(18);

    const names = registered.map((t) => t.name).sort();
    expect(names).toEqual(
      [
        'careers_get_context',
        'careers_search_jobs',
        'careers_get_job',
        'careers_open_job',
        'careers_open_page',
        'careers_get_site_info',
        'careers_get_saved_jobs',
        'careers_set_saved_job',
        'careers_get_my_applications',
        'careers_get_application',
        'careers_start_application',
        'careers_update_application',
        'careers_submit_application',
        'careers_set_search_view',
        'careers_focus_application_field',
        'careers_create_account',
        'careers_create_export',
        'careers_read_export',
      ].sort(),
    );
  });

  it('does not register twice for the same ModelContext (StrictMode double-mount safe)', async () => {
    const shim = createModelContextShim();
    await registerCareersTools(shim as unknown as WebMCP.ModelContext);
    await registerCareersTools(shim as unknown as WebMCP.ModelContext);
    const registered = await shim.getTools();
    expect(registered).toHaveLength(18);
  });

  it('registers a fresh ModelContext independently', async () => {
    const shimA = createModelContextShim();
    const shimB = createModelContextShim();
    await registerCareersTools(shimA as unknown as WebMCP.ModelContext);
    await registerCareersTools(shimB as unknown as WebMCP.ModelContext);
    expect(await shimA.getTools()).toHaveLength(18);
    expect(await shimB.getTools()).toHaveLength(18);
  });

  it('sets readOnlyHint exactly on the 8 read tools', () => {
    const readOnlyNames = [
      'careers_get_context',
      'careers_search_jobs',
      'careers_get_job',
      'careers_get_site_info',
      'careers_get_saved_jobs',
      'careers_get_my_applications',
      'careers_get_application',
      'careers_read_export',
    ];
    for (const tool of getToolDefinitions()) {
      if (readOnlyNames.includes(tool.name)) {
        expect(tool.annotations.readOnlyHint).toBe(true);
      } else {
        expect(tool.annotations.readOnlyHint).not.toBe(true);
      }
    }
  });

  it('sets untrustedContentHint exactly on tools returning job/user content', () => {
    const untrustedNames = [
      'careers_get_context',
      'careers_search_jobs',
      'careers_get_job',
      'careers_open_job',
      'careers_get_site_info',
      'careers_get_saved_jobs',
      'careers_get_my_applications',
      'careers_get_application',
      'careers_update_application',
      'careers_focus_application_field',
      'careers_create_export',
      'careers_read_export',
    ];
    for (const tool of getToolDefinitions()) {
      if (untrustedNames.includes(tool.name)) {
        expect(tool.annotations.untrustedContentHint).toBe(true);
      } else {
        expect(tool.annotations.untrustedContentHint).not.toBe(true);
      }
    }
  });

  it('mutating tools do not claim readOnlyHint', () => {
    const mutatingNames = [
      'careers_open_job',
      'careers_open_page',
      'careers_set_saved_job',
      'careers_start_application',
      'careers_update_application',
      'careers_submit_application',
      'careers_set_search_view',
      'careers_focus_application_field',
      'careers_create_account',
      'careers_create_export',
    ];
    for (const tool of getToolDefinitions()) {
      if (mutatingNames.includes(tool.name)) {
        expect(tool.annotations.readOnlyHint).not.toBe(true);
      }
    }
  });

  it('no tool description embeds job or application content', () => {
    const forbidden = /staff platform engineer|infrastructure|avery chen|kubernetes/i;
    for (const tool of tools) {
      expect(tool.description).not.toMatch(forbidden);
      expect(tool.title).not.toMatch(forbidden);
    }
  });

  it('every tool description stays under 300 characters', () => {
    for (const tool of tools) {
      expect(tool.description.length).toBeLessThanOrEqual(300);
    }
  });

  it('every tool has a non-empty inputSchema object with additionalProperties:false where object-typed', () => {
    for (const tool of tools) {
      expect(typeof tool.inputSchema).toBe('object');
      const schema = tool.inputSchema as { type?: string; additionalProperties?: boolean };
      if (schema.type === 'object') {
        expect(schema.additionalProperties).toBe(false);
      }
    }
  });
});
