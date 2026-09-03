'use client';
/**
 * Human-facing view of an export the agent (or the Export CSV button) created.
 *
 * The agent gets a handle to this same record and reads it in slices; this page
 * is where the person sees and downloads the identical file.
 */
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Download, FileSpreadsheet } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useExportsStore, toCsv, exportFilename, type ExportRecord } from '@/domain/exports';

/** Rows rendered on the page. The full file is always in the download. */
const PREVIEW_ROWS = 25;

function download(record: ExportRecord) {
  const blob = new Blob([toCsv(record.columns, record.rows)], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = exportFilename(record);
  link.click();
  URL.revokeObjectURL(url);
}

export default function ExportPage() {
  const params = useParams<{ id: string }>();
  const record = useExportsStore((s) => s.exports[params.id] ?? null);

  if (!record) {
    return (
      <main className="container mx-auto px-4 py-20 text-center sm:py-28">
        <h1 className="text-2xl font-semibold">Export not found</h1>
        <p className="mt-2 text-muted-foreground">
          Exports live for the current browser tab only. Run the export again to get a fresh copy.
        </p>
        <Button variant="link" asChild className="mt-4">
          <Link href="/careers/open-positions">Back to open positions</Link>
        </Button>
      </main>
    );
  }

  const preview = record.rows.slice(0, PREVIEW_ROWS);

  return (
    <main className="container mx-auto px-4 py-16 sm:py-24">
      <Card data-testid="export-view">
        <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-4">
          <div className="space-y-1.5">
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-muted-foreground" />
              {record.label}
            </CardTitle>
            <CardDescription>
              <span data-testid="export-row-count">{record.rows.length}</span>{' '}
              {record.rows.length === 1 ? 'row' : 'rows'} · {record.columns.length} columns ·{' '}
              {exportFilename(record)}
            </CardDescription>
          </div>
          <Button onClick={() => download(record)} data-testid="export-download">
            <Download className="mr-2 h-4 w-4" />
            Download CSV
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {record.columns.map((column) => (
                    <TableHead key={column} className="whitespace-nowrap">
                      {column}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {preview.map((row, index) => (
                  <TableRow key={index}>
                    {record.columns.map((column) => (
                      <TableCell key={column} className="max-w-[22rem] truncate whitespace-nowrap">
                        {row[column]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {record.rows.length > preview.length && (
            <p className="mt-3 text-sm text-muted-foreground">
              Showing the first {preview.length} of {record.rows.length} rows. The download contains all of them.
            </p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
