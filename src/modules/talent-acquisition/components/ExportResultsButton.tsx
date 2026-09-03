'use client';
/**
 * Download the current job results as CSV.
 *
 * This is a normal site feature — it works with no agent present — and it is
 * deliberately the same code path `careers_create_export` uses, so the file a
 * human downloads and the rows an agent slices are identical (BUILD_CONTRACT
 * #42: don't build fields or capabilities only an agent can reach).
 */
import { useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Job, Country, Department } from '@/lib/talent-acquisition';
import { normalizeJob } from '@/domain/jobs/normalize';
import { createExport, jobsToRows, JOB_EXPORT_COLUMNS, toCsv, exportFilename } from '@/domain/exports';
import { getCurrentCandidate } from '@/domain/session/session.store';

interface ExportResultsButtonProps {
  jobs: Job[];
  departments: Department[];
  countries: Country[];
}

export function ExportResultsButton({ jobs, departments, countries }: ExportResultsButtonProps) {
  const [busy, setBusy] = useState(false);

  const handleExport = () => {
    if (jobs.length === 0) return;
    setBusy(true);
    try {
      const rows = jobsToRows(jobs.map((job) => normalizeJob(job, departments, countries)));
      const record = createExport({
        dataset: 'jobs',
        format: 'csv',
        columns: [...JOB_EXPORT_COLUMNS],
        rows,
        label: 'Search results',
        candidateId: getCurrentCandidate()?.id ?? null,
      });

      const blob = new Blob([toCsv(record.columns, record.rows)], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = exportFilename(record);
      link.click();
      URL.revokeObjectURL(url);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={busy || jobs.length === 0}
      data-testid="export-results"
    >
      <Download className="mr-2 h-4 w-4" />
      Export CSV
    </Button>
  );
}
