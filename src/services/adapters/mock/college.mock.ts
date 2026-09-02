
import { College, mockColleges as allMockColleges } from '@/mocks/colleges.mock';
import { PaginatedResponse, TableQuery } from '@/components/system/DataTable';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

let mockColleges: College[] = [...allMockColleges];

export const collegeMockService = {
  async getColleges(query: TableQuery): Promise<PaginatedResponse<College & {id: string}>> {
    await delay(300);
    const { page = 1, limit = 10, search, sortBy, sortOrder } = query;

    let filteredData: (College & { id: string })[] = [...mockColleges].map(c => ({...c, id: c.collegeId}));

    if (search) {
        const searchTerm = search.toLowerCase();
        filteredData = filteredData.filter(c =>
            c.name.toLowerCase().includes(searchTerm) ||
            c.city.toLowerCase().includes(searchTerm) ||
            c.state.toLowerCase().includes(searchTerm)
        );
    }
    
    if (sortBy) {
        filteredData.sort((a, b) => {
            const aValue = (a as any)[sortBy];
            const bValue = (b as any)[sortBy];
            if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
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

  async getAllColleges(): Promise<(College & { id: string; type: "1" | "2" | "3" })[]> {
      await delay(100);
      return mockColleges.map((c, i) => ({
          ...c,
          id: c.collegeId,
          type: (((i % 3) + 1).toString() as "1" | "2" | "3"),
      }));
  },

  async createCollege(college: Omit<College, 'collegeId'>): Promise<College> {
    await delay(200);
    const newCollege = {
      ...college,
      collegeId: 'col-' + Math.floor(Math.random() * 1000),
    };
    mockColleges.push(newCollege);
    return newCollege;
  },

  async updateCollege(college: College): Promise<College> {
    await delay(200);
    const index = mockColleges.findIndex(c => c.collegeId === college.collegeId);
    if (index > -1) {
      mockColleges[index] = college;
      return college;
    }
    throw new Error('College not found');
  },

  async deleteCollege(collegeId: string): Promise<{ success: boolean }> {
    await delay(200);
    const initialLength = mockColleges.length;
    mockColleges = mockColleges.filter(c => c.collegeId !== collegeId);
    if (mockColleges.length === initialLength) {
        throw new Error("College not found");
    }
    return { success: true };
  }
};
