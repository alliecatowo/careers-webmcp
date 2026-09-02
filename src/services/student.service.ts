
import { adapter } from './adapter';
import { TableQuery, PaginatedResponse } from '@/components/system/DataTable';
import { Student } from '../modules/students/domain/student.entity';

export const studentService = {
  getStudents: (query: TableQuery): Promise<PaginatedResponse<Student>> => adapter.getStudents(query),
  getAllStudents: (): Promise<Student[]> => adapter.getAllStudents(),
  createStudent: (data: Omit<Student, 'studentId'>): Promise<Student> => adapter.createStudent(data),
  updateStudent: (data: Student): Promise<Student> => adapter.updateStudent(data),
  deleteStudent: (studentId: string): Promise<{ success: boolean }> => adapter.deleteStudent(studentId),
};
