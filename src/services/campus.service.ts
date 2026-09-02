import { adapter } from './adapter';
import { TableQuery, PaginatedResponse } from '@/components/system/DataTable';
import { ApplicationMatch } from '@/modules/campus/types/campus.types';
import { Student } from '@/modules/students/domain/student.entity';

export const campusService = {
  getAIMatches: (query: TableQuery): Promise<PaginatedResponse<ApplicationMatch>> => adapter.getAIMatches(query),
  getRecentPlacements: (limit: number): Promise<Student[]> => adapter.getRecentPlacements(limit),
};
