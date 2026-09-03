/**
 * Candidate-facing data exports, shared by the human "Export CSV" button and
 * the WebMCP `careers_create_export` / `careers_read_export` tools.
 *
 * Why this exists: a WebMCP tool result is a plain JS value, so there is no
 * "file handle" in the protocol. Dumping a whole result set into a tool result
 * would blow the output bounds in BUILD_CONTRACT #37. Instead an export is
 * created once as a real, human-downloadable artifact, and the agent gets back
 * a *handle* (id + shape + a preview) that it can then read in slices with
 * `careers_read_export` — pulling only the columns and rows it actually needs.
 */
export type ExportDataset = 'jobs' | 'applications';
export type ExportFormat = 'csv' | 'json';

export interface ExportRecord {
  id: string;
  dataset: ExportDataset;
  format: ExportFormat;
  /** Column names, in order. */
  columns: string[];
  /** One object per row, keyed by column name. Values are already stringified. */
  rows: Record<string, string>[];
  /** Our own label, e.g. "Search results". Never untrusted content. */
  label: string;
  createdAt: string;
  /** Candidate the export was created for, or null for a signed-out jobs export. */
  candidateId: string | null;
}

/** Hard ceiling on rows retained per export, so an export can't grow unbounded. */
export const EXPORT_MAX_ROWS = 500;
/** Max rows a single `careers_read_export` call may return. */
export const EXPORT_READ_MAX = 100;
/** Rows included inline in the create response so the agent can sanity-check shape. */
export const EXPORT_PREVIEW_ROWS = 3;

export {
  createExport,
  getExport,
  listExports,
  readExport,
  clearExports,
  useExportsStore,
  EXPORTS_STORAGE_KEY,
} from './export.store';
export type { ExportSlice } from './export.store';
export { toCsv, exportFilename } from './csv';
export { jobsToRows, JOB_EXPORT_COLUMNS, applicationsToRows, APPLICATION_EXPORT_COLUMNS } from './rows';
