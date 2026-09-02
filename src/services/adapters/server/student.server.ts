import { apiClient } from "@/lib/apiClient";
import { TableQuery } from "@/components/system/DataTable";

// Placeholder for server adapter
export const studentServerService = {
  getStudents: (query: TableQuery) => apiClient.get(`/students?${new URLSearchParams(query as any)}`),
  createStudent: (data: any) => apiClient.post('/students', data),
  updateStudent: (data: any) => apiClient.put(`/students/${data.studentId}`, data),
  deleteStudent: (studentId: string) => apiClient.delete(`/students/${studentId}`),
};
