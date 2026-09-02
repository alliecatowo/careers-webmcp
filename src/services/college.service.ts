
import { adapter } from './adapter';
import { College, mockColleges } from '@/mocks/colleges.mock';
import { PaginatedResponse, TableQuery } from '@/components/system/DataTable';

interface CollegeWithType extends College {
  id: string;
  type: "1" | "2" | "3";
}

const getAllColleges = async (): Promise<CollegeWithType[]> => {
    // In a real app, this would be a different endpoint. Here, we can just return the mock data.
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockColleges.map((c, i) => ({
      ...c,
      id: c.collegeId,
      type: ( (i % 3) + 1).toString() as "1" | "2" | "3", // Add mock type based on index
    }));
};

export const collegeService = {
    getColleges: (query: TableQuery): Promise<PaginatedResponse<College & { id: string }>> => adapter.getColleges(query),
    getAllColleges,
    createCollege: (data: Omit<College, 'collegeId'>): Promise<College> => adapter.createCollege(data),
    updateCollege: (data: College): Promise<College> => adapter.updateCollege(data),
    deleteCollege: (collegeId: string): Promise<{ success: boolean }> => adapter.deleteCollege(collegeId),
};
