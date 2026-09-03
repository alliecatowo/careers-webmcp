/**
 * Wraps every tool's `execute` so the page can show a transient echo of agent
 * activity. Purely additive: the wrapper never changes the value a tool
 * returns, and it swallows its own errors so a presence bug can never break a
 * tool call.
 *
 * Labels and captions here are authored by us and never interpolate untrusted
 * job/application text (BUILD_CONTRACT #36) — only our own strings and counts.
 */
import type { CareersTool } from '../tools';
import { beginActivity, endActivity } from './presence.store';

/** Present-tense labels shown in the presence pill. Authored, not derived. */
const LABELS: Record<string, string> = {
  careers_get_context: 'Reading page context',
  careers_search_jobs: 'Searching jobs',
  careers_set_search_view: 'Filling in the search',
  careers_get_job: 'Reading a job posting',
  careers_open_job: 'Opening a job',
  careers_open_page: 'Opening a page',
  careers_get_site_info: 'Reading about the company',
  careers_get_saved_jobs: 'Checking saved jobs',
  careers_set_saved_job: 'Updating saved jobs',
  careers_get_my_applications: 'Checking your applications',
  careers_get_application: 'Reading your application',
  careers_start_application: 'Starting an application',
  careers_update_application: 'Filling in your application',
  careers_focus_application_field: 'Pointing at a field',
  careers_submit_application: 'Preparing your application — waiting for you',
  careers_create_account: 'Setting up your account',
  careers_create_export: 'Preparing an export',
  careers_read_export: 'Reading the export',
};

function pluralize(n: number, one: string, many = `${one}s`): string {
  return `${n} ${n === 1 ? one : many}`;
}

/**
 * Derive a short caption from a tool's own structured result. Only reads
 * counts, booleans and our own enum values — never free text from a job post
 * or an application.
 */
function captionFor(tool: string, data: unknown): string | null {
  if (!data || typeof data !== 'object') return null;
  const d = data as Record<string, any>;

  switch (tool) {
    case 'careers_search_jobs':
      return typeof d.totalMatches === 'number' ? pluralize(d.totalMatches, 'match', 'matches') : null;
    case 'careers_set_search_view':
      return typeof d.totalMatches === 'number' ? pluralize(d.totalMatches, 'result') : 'search updated';
    case 'careers_get_saved_jobs':
      return Array.isArray(d.savedJobs) ? pluralize(d.savedJobs.length, 'saved job') : null;
    case 'careers_set_saved_job':
      return d.saved ? 'saved' : 'removed';
    case 'careers_get_my_applications':
      return Array.isArray(d.applications) ? pluralize(d.applications.length, 'application') : null;
    case 'careers_update_application':
      return typeof d.updatedFieldCount === 'number'
        ? `${pluralize(d.updatedFieldCount, 'field')} filled`
        : 'updated';
    case 'careers_start_application':
      return d.created ? 'draft created' : 'draft resumed';
    case 'careers_submit_application':
      return d.status === 'submitted' ? 'submitted' : 'waiting for you';
    case 'careers_create_account':
      return d.alreadySignedIn ? 'already signed in' : 'ready for you to confirm';
    case 'careers_create_export':
      return typeof d.rowCount === 'number' ? `${pluralize(d.rowCount, 'row')} ready` : null;
    case 'careers_read_export':
      return typeof d.returnedRows === 'number' ? `${pluralize(d.returnedRows, 'row')} read` : null;
    case 'careers_open_job':
      return d.opened ? 'opened' : null;
    case 'careers_open_page':
      return typeof d.label === 'string' && d.opened ? 'opened' : null;
    case 'careers_focus_application_field':
      return d.focused ? 'highlighted' : null;
    default:
      return null;
  }
}

function isErrorResult(result: unknown): boolean {
  return !!result && typeof result === 'object' && (result as { isError?: boolean }).isError === true;
}

function structured(result: unknown): unknown {
  if (result && typeof result === 'object' && 'structuredContent' in result) {
    return (result as { structuredContent?: unknown }).structuredContent;
  }
  return undefined;
}

/** Returns a copy of `tool` whose execute reports presence. Never mutates the input. */
export function instrument(tool: CareersTool): CareersTool {
  const label = LABELS[tool.name] ?? 'Working';
  return {
    ...tool,
    execute: async (input, options) => {
      let activityId: number | null = null;
      try {
        activityId = beginActivity(tool.name, label);
      } catch {
        // Presence must never block a tool call.
      }
      try {
        const result = await tool.execute(input, options);
        if (activityId !== null) {
          try {
            const errored = isErrorResult(result);
            endActivity(
              activityId,
              errored ? 'error' : 'done',
              errored ? null : captionFor(tool.name, structured(result)),
            );
          } catch {
            /* ignore */
          }
        }
        return result;
      } catch (err) {
        if (activityId !== null) {
          try {
            endActivity(activityId, 'error', null);
          } catch {
            /* ignore */
          }
        }
        throw err;
      }
    },
  };
}

export function instrumentAll(list: CareersTool[]): CareersTool[] {
  return list.map(instrument);
}
