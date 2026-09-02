
import { adapter } from '@/services/adapter';
import { TableQuery, PaginatedResponse } from '@/components/system/DataTable';
import { Student } from '../domain/student.entity';

export const studentService = {
  getStudents: (query: TableQuery): Promise<PaginatedResponse<Student>> => adapter.getStudents(query),
  getAllStudents: (): Promise<(Student & {id: string})[]> => adapter.getAllStudents(),
  createStudent: (data: Omit<Student, 'studentId'>): Promise<Student> => adapter.createStudent(data),
  updateStudent: (data: Student): Promise<Student> => adapter.updateStudent(data),
  deleteStudent: (studentId: string): Promise<{ success: boolean }> => adapter.deleteStudent(studentId),
};
