
import { DashboardData, PipelineStats } from '../domain/dashboard.entity';
import { candidateService } from '@/services/candidate.service';
import { talentService } from '@/services/talent.service';
import { interviewService } from '@/services/interview.service';
import { offerService } from '@/services/offer.service';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const dashboardMockService = {
  async getDashboardData(): Promise<DashboardData> {
    await delay(800);

    try {
      // In a real app, these would be efficient backend queries.
      // Here, we leverage our existing mock services to compose the data.
      const [
        jobsResponse,
        latestCandidates,
        interviews,
        offers,
        allCandidatesResponse,
      ] = await Promise.all([
        talentService.getJobs({ page: 1, limit: 1000 }), // Get all jobs for stats
        candidateService.getLatestCandidates(5),
        interviewService.getAllInterviews(),
        offerService.getAll(),
        candidateService.getCandidates({ page: 1, limit: 1000 }), // For pipeline stats
      ]);

      const openJobs = jobsResponse.data.filter(job => job.status === 'published');

      const newCandidatesCount = latestCandidates.filter(c =>
        new Date(c.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length;

      const interviewsToday = interviews.filter(i => {
        const interviewDate = new Date(i.scheduledAt);
        const today = new Date();
        return interviewDate.getDate() === today.getDate() &&
          interviewDate.getMonth() === today.getMonth() &&
          interviewDate.getFullYear() === today.getFullYear();
      }).length;

      const offersPending = offers.filter(o => o.status === 'PENDING_APPROVAL' || o.status === 'SENT').length;

      const stats = {
        openJobs: openJobs.length,
        newCandidates: newCandidatesCount,
        interviewsToday,
        offersPending,
      };

      const pipelineCounts = allCandidatesResponse.data.reduce((acc, candidate) => {
        const stage = candidate.stage;
        if (stage !== 'HIRED' && stage !== 'REJECTED') {
          acc[stage] = (acc[stage] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      const pipelineOverview: PipelineStats[] = [
        { stage: 'Screening', count: pipelineCounts['SCREENING'] || 0 },
        { stage: 'Interview', count: (pipelineCounts['TECHNICAL_ROUND'] || 0) + (pipelineCounts['HR_ROUND'] || 0) + (pipelineCounts['FINAL_ROUND'] || 0) },
        { stage: 'Offer', count: pipelineCounts['OFFER'] || 0 },
      ];

      return {
        stats,
        latestCandidates,
        openPositions: openJobs.slice(0, 5).map(j => ({ id: j.id, title: j.title, department: j.departmentId, applicants: Math.floor(Math.random() * 50) })),
        pipelineOverview,
      };
    } catch (error) {
      console.error("Error fetching mock dashboard data:", error);
      // Return a default empty state on error
      return {
        stats: { openJobs: 0, newCandidates: 0, interviewsToday: 0, offersPending: 0 },
        latestCandidates: [],
        openPositions: [],
        pipelineOverview: [],
      }
    }
  },
};
