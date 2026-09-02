import { mockStudents as allMockStudents } from '@/mocks/students.mock';
import { TableQuery, PaginatedResponse } from '@/components/system/DataTable';
import { Student } from '@/modules/students/domain/student.entity';

let mockStudents: any[] = allMockStudents.map((s) => ({
  ...s,
  studentId: `stu-${s.id}`,
}));

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const studentMockService = {
  async getStudents(query: TableQuery): Promise<PaginatedResponse<Student>> {
    await delay(300);
    const { page = 1, limit = 10, search } = query;

    let filteredData = [...mockStudents];

    if (search) {
      const searchTerm = search.toLowerCase();
      filteredData = filteredData.filter(
        (s) =>
          s.name.toLowerCase().includes(searchTerm) ||
          s.email.toLowerCase().includes(searchTerm),
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

  async getAllStudents(): Promise<Student[]> {
    await delay(100);
    return [...mockStudents].map((s) => ({ ...s, id: s.studentId }));
  },

  async createStudent(student: Omit<Student, 'studentId'>): Promise<Student> {
    await delay(200);
    const newStudent = {
      ...student,
      id: `stu-${Date.now()}`, // Convert to string
      studentId: 'stu-' + Math.floor(Math.random() * 1000),
    };
    mockStudents.push(newStudent);
    return newStudent;
  },

  async updateStudent(student: Student): Promise<Student> {
    await delay(200);
    const index = mockStudents.findIndex(
      (s) => s.studentId === student.studentId,
    );
    if (index > -1) {
      mockStudents[index] = student;
      return student;
    }
    throw new Error('Student not found');
  },

  async deleteStudent(studentId: string): Promise<{ success: boolean }> {
    await delay(200);
    const initialLength = mockStudents.length;
    mockStudents = mockStudents.filter((s) => s.studentId !== studentId);
    if (mockStudents.length === initialLength) {
      throw new Error('Student not found');
    }
    return { success: true };
  },
};
