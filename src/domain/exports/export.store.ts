'use client';
/**
 * Export registry. Persisted to sessionStorage so the human can follow the
 * agent's download link to /careers/exports/[id] on a fresh page render, but
 * scoped to the tab and gone when it closes — an export is a demo artifact,
 * not durable data.
 */
import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';
import {
  EXPORT_MAX_ROWS,
  EXPORT_READ_MAX,
  type ExportDataset,
  type ExportFormat,
  type ExportRecord,
} from './index';

export const EXPORTS_STORAGE_KEY = 'careers.exports.v1';

/** Keep only the newest N exports so a long session can't grow without bound. */
const MAX_RETAINED_EXPORTS = 10;

interface ExportsState {
  exports: Record<string, ExportRecord>;
  order: string[];
  nextId: number;
}

function createMemoryStorage(): StateStorage {
  const memory = new Map<string, string>();
  return {
    getItem: (name) => memory.get(name) ?? null,
    setItem: (name, value) => {
      memory.set(name, value);
    },
    removeItem: (name) => {
      memory.delete(name);
    },
  };
}

const storageImpl: StateStorage =
  typeof sessionStorage === 'undefined' ? createMemoryStorage() : (sessionStorage as unknown as StateStorage);

export const useExportsStore = create<ExportsState>()(
  persist((): ExportsState => ({ exports: {}, order: [], nextId: 1 }), {
    name: EXPORTS_STORAGE_KEY,
    storage: createJSONStorage(() => storageImpl),
  }),
);

export interface CreateExportInput {
  dataset: ExportDataset;
  format: ExportFormat;
  columns: string[];
  rows: Record<string, string>[];
  label: string;
  candidateId: string | null;
}

export function createExport(input: CreateExportInput): ExportRecord {
  const state = useExportsStore.getState();
  const id = `exp_${state.nextId}`;
  const record: ExportRecord = {
    id,
    dataset: input.dataset,
    format: input.format,
    columns: [...input.columns],
    rows: input.rows.slice(0, EXPORT_MAX_ROWS),
    label: input.label,
    createdAt: new Date().toISOString(),
    candidateId: input.candidateId,
  };

  const order = [...state.order, id].slice(-MAX_RETAINED_EXPORTS);
  const exports: Record<string, ExportRecord> = { ...state.exports, [id]: record };
  for (const key of Object.keys(exports)) {
    if (!order.includes(key)) delete exports[key];
  }

  useExportsStore.setState({ exports, order, nextId: state.nextId + 1 });
  return record;
}

export function getExport(id: string): ExportRecord | null {
  return useExportsStore.getState().exports[id] ?? null;
}

/** Newest first. */
export function listExports(): ExportRecord[] {
  const { exports, order } = useExportsStore.getState();
  return [...order].reverse().map((id) => exports[id]).filter((r): r is ExportRecord => !!r);
}

export interface ExportSlice {
  exportId: string;
  dataset: ExportDataset;
  columns: string[];
  offset: number;
  limit: number;
  /** Total rows in the whole export, not in this slice. */
  rowCount: number;
  returnedRows: number;
  hasMore: boolean;
  rows: Record<string, string>[];
}

/**
 * Read a bounded window of an export. `columns` narrows the projection so an
 * agent scanning for, say, compensation doesn't pull job descriptions too.
 * Unknown column names are ignored rather than erroring.
 */
export function readExport(
  id: string,
  options: { offset?: number; limit?: number; columns?: string[] } = {},
): ExportSlice | null {
  const record = getExport(id);
  if (!record) return null;

  const offset = Math.max(0, Math.floor(options.offset ?? 0));
  const limit = Math.min(EXPORT_READ_MAX, Math.max(1, Math.floor(options.limit ?? EXPORT_READ_MAX)));

  const requested = options.columns?.filter((c) => record.columns.includes(c));
  const columns = requested && requested.length > 0 ? requested : record.columns;

  const window_ = record.rows.slice(offset, offset + limit);
  const rows = window_.map((row) => Object.fromEntries(columns.map((c) => [c, row[c] ?? ''])));

  return {
    exportId: record.id,
    dataset: record.dataset,
    columns,
    offset,
    limit,
    rowCount: record.rows.length,
    returnedRows: rows.length,
    hasMore: offset + rows.length < record.rows.length,
    rows,
  };
}

/** Test helper. */
export function clearExports(): void {
  useExportsStore.setState({ exports: {}, order: [], nextId: 1 });
}
