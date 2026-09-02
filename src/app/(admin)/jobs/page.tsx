'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { JobsFilters } from '@/modules/jobs/components/JobsFilters';
import { PaginationControls } from '@/modules/jobs/components/PaginationControls';
import { JobsTableSkeleton } from '@/modules/jobs/components/JobsSkeleton';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/components/system/Toast/useToast';
import { talentService } from '@/services/talent.service';
import { useAuth } from '@/hooks/useAuth';
import { AdminJobsQueryParams, useAdminJobs } from '@/modules/jobs/jobs.hooks';
import { Job } from '@/lib/talent-acquisition';
import { JobsTable } from '@/modules/jobs/components/JobsTable';

const JobFormDrawer = dynamic(
  () =>
    import('@/modules/jobs/components/JobFormDrawer').then(
      (mod) => mod.JobFormDrawer,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    ),
  },
);

export default function JobsPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);

  const [queryParams, setQueryParams] = useState<AdminJobsQueryParams>({
    page: 1,
    limit: 10,
    search: '',
  });

  const {
    data: jobsResponse,
    isLoading,
    isError,
    mutate,
  } = useAdminJobs(queryParams);

  const handleEdit = (job: Job) => {
    setEditingJobId(job.id);
    setIsDrawerOpen(true);
  };

  const handleCreate = () => {
    setEditingJobId(null);
    setIsDrawerOpen(true);
  };

  const handleSaveSuccess = () => {
    setIsDrawerOpen(false);
    showToast({
      type: 'success',
      title: 'Success',
      description: `Job has been successfully ${
        editingJobId ? 'updated' : 'created'
      }.`,
    });
    mutate();
  };

  const handleDelete = async (id: string) => {
    try {
      // In real app, this would be talentService.deleteJob(id)
      // await talentService.delete(id);
      showToast({
        type: 'success',
        title: 'Job Deleted',
        description: `Job has been removed.`,
      });
      mutate();
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        description: 'Failed to delete job.',
      });
    }
  };

  const setPage = (page: number) => {
    setQueryParams((prev) => ({ ...prev, page }));
  };

  const setFilters = (
    newFilters:
      | Omit<AdminJobsQueryParams, 'page' | 'limit'>
      | ((
          prev: Omit<AdminJobsQueryParams, 'page' | 'limit'>,
        ) => Omit<AdminJobsQueryParams, 'page' | 'limit'>),
  ) => {
    setQueryParams((prev) => {
      const filters =
        typeof newFilters === 'function'
          ? newFilters({
              search: prev.search,
              department: prev.department,
              status: prev.status,
            })
          : newFilters;
      return { ...prev, ...filters, page: 1 };
    });
  };

  if (isError) return <div>Failed to load jobs. Please try again.</div>;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Job Management</h1>
          <p className="text-muted-foreground">
            Create, edit, and manage all job postings.
          </p>
        </div>
        <Button onClick={handleCreate}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Job
        </Button>
      </div>

      {jobsResponse?.allDepartments && (
        <JobsFilters
          filters={queryParams}
          setFilters={setFilters}
          allDepartments={jobsResponse.allDepartments}
        />
      )}

      {isLoading ? (
        <JobsTableSkeleton />
      ) : (
        jobsResponse && (
          <JobsTable
            jobs={jobsResponse.data}
            departments={jobsResponse.allDepartments}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )
      )}

      {jobsResponse && (
        <PaginationControls
          page={queryParams.page || 1}
          setPage={setPage}
          totalPages={jobsResponse.totalPages}
          totalItems={jobsResponse.total}
          itemsCount={jobsResponse.data.length}
          limit={jobsResponse.limit}
        />
      )}

      {isDrawerOpen && user && (
        <JobFormDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          jobId={editingJobId}
          onSaveSuccess={handleSaveSuccess}
        />
      )}
    </div>
  );
}
