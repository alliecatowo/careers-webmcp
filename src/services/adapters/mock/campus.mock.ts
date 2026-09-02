import { mockStudents } from '@/mocks/students.mock';
import { mockJobs } from '@/mocks/talent-platform/jobs.mock';
import { ApplicationMatch } from '@/modules/campus/types/campus.types';
import { TableQuery, PaginatedResponse } from '@/components/system/DataTable';
import { Student } from '@/modules/students/domain/student.entity';

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const getMockApplications = (): ApplicationMatch[] => {
  // Generate some mock applications on the fly
  const applications: ApplicationMatch[] = [];
  mockStudents.forEach((student, i) => {
    // Have each student apply to a job that somewhat matches their course
    const matchingJob =
      mockJobs.find((job) =>
        student.course.includes(job.title.split(' ')[0]),
      ) || mockJobs[i % mockJobs.length];
    if (matchingJob) {
      applications.push({
        id: `app-campus-${i}`,
        studentId: student.studentId,
        studentName: student.name,
        jobId: matchingJob.id,
        jobTitle: matchingJob.title,
        score: 0, // Will be calculated by AI
        status: 'Applied',
      });
    }
  });
  return applications;
};

const runAIMatching = (
  applications: ApplicationMatch[],
): ApplicationMatch[] => {
  return applications.map((app) => {
    const score = 50 + Math.floor(Math.random() * 51); // Random score 50-100
    let status: 'Placed' | 'Interview' | 'Rejected' | 'Applied' = 'Applied';
    if (score > 85) status = 'Placed';
    else if (score > 70) status = 'Interview';
    else status = 'Rejected';
    return { ...app, score, status };
  });
};

let cachedMatches: ApplicationMatch[] | null = null;

export const campusMockService = {
  async getAIMatches(
    query: TableQuery,
  ): Promise<PaginatedResponse<ApplicationMatch>> {
    await delay(500);

    // The "AI" is "run" by generating new scores and statuses.
    const allApplications = getMockApplications();
    cachedMatches = runAIMatching(allApplications);

    const { page = 1, limit = 10, search } = query;
    let filteredData = cachedMatches;

    if (search) {
      const searchTerm = search.toLowerCase();
      filteredData = filteredData.filter(
        (match) =>
          match.studentName.toLowerCase().includes(searchTerm) ||
          match.jobTitle.toLowerCase().includes(searchTerm),
      );
    }

    const total = filteredData.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedData = filteredData.slice(start, end);

    return {
      data: paginatedData,
      total,
      page,
      limit,
      totalPages,
    };
  },
  async getRecentPlacements(limit: number): Promise<Student[]> {
    await delay(400);
    return mockStudents
      .filter((s) => s.isPlaced)
      .slice(0, limit)
      .map((s) => ({
        ...s,
        id: `stu-${s.id}`, // Convert number ID to string
        studentId: `stu-00${s.id}`,
      }));
  },
};
