
import { mockAdapter } from './adapters/mock';
import { serverAdapter } from './adapters/server';
import { ApiAdapter } from './adapters/api.adapter';
import { collegeMockService } from './adapters/mock/college.mock';
import { studentMockService } from '@/modules/students/services/student.mock';
import { campusMockService } from './adapters/mock/campus.mock';
import { placementMockService } from './adapters/mock/placement.mock';
import { analyticsMockService } from '@/modules/analytics/services/analytics.mock';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

// This is a temporary merge until the adapters are fully unified.
const mergedMockAdapter: ApiAdapter = {
  ...mockAdapter,
  getColleges: collegeMockService.getColleges,
  getAllColleges: collegeMockService.getAllColleges,
  createCollege: collegeMockService.createCollege,
  updateCollege: collegeMockService.updateCollege,
  deleteCollege: collegeMockService.deleteCollege,
  getStudents: studentMockService.getStudents,
  getAllStudents: studentMockService.getAllStudents,
  createStudent: studentMockService.createStudent,
  updateStudent: studentMockService.updateStudent,
  deleteStudent: studentMockService.deleteStudent,
  getAIMatches: campusMockService.getAIMatches,
  getRecentPlacements: campusMockService.getRecentPlacements,
  getPendingPlacements: placementMockService.getPendingPlacements,
  getApprovedPlacements: placementMockService.getApprovedPlacements,
  approvePlacement: placementMockService.approvePlacement,
  getDashboardData: analyticsMockService.getDashboardData,
};

export const adapter: ApiAdapter = USE_MOCK ? mergedMockAdapter : serverAdapter;
