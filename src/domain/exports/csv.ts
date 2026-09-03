/** RFC 4180-style CSV serialization. No dependencies, deterministic output. */
import type { ExportRecord } from './index';

function escapeCell(value: string): string {
  // Neutralize spreadsheet formula injection, then quote per RFC 4180.
  const safe = /^[=+\-@]/.test(value) ? `'${value}` : value;
  if (/[",\r\n]/.test(safe)) {
    return `"${safe.replace(/"/g, '""')}"`;
  }
  return safe;
}

export function toCsv(columns: string[], rows: Record<string, string>[]): string {
  const header = columns.map(escapeCell).join(',');
  const body = rows.map((row) => columns.map((c) => escapeCell(row[c] ?? '')).join(','));
  return [header, ...body].join('\r\n');
}

export function exportFilename(record: Pick<ExportRecord, 'dataset' | 'format' | 'createdAt'>): string {
  const stamp = record.createdAt.slice(0, 10);
  return `northwind-${record.dataset}-${stamp}.${record.format}`;
}
