'use client';

import { useState, useMemo } from 'react';
import useSWR from 'swr';
import { useDataTable } from '@/hooks/useDataTable';
import { DataTable } from '@/components/system/DataTable';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/system/Toast/useToast';
import { PlusCircle } from 'lucide-react';
import { Student } from '@/modules/students/domain/student.entity';
import { studentService } from '@/modules/students/services/student.service';
import { collegeService } from '@/services/college.service';
import { College } from '@/mocks/colleges.mock';
import { studentColumns } from '@/modules/students/components/StudentColumns';

export default function StudentDashboardPage() {
  const { showToast } = useToast();

  const { data: colleges } = useSWR('colleges', collegeService.getAllColleges);

  const {
    data: studentsResponse,
    isLoading,
    error,
    query,
    setQuery,
    refresh,
  } = useDataTable<Student>({
    fetchData: studentService.getStudents,
  });

  const studentsWithCollege = useMemo(() => {
    if (!studentsResponse?.data || !colleges) return [];
    const collegeMap = new Map(colleges.map((c) => [c.collegeId, c.name]));
    return studentsResponse.data.map((s) => ({
      ...s,
      collegeName: collegeMap.get(s.collegeId) || 'Unknown College',
    }));
  }, [studentsResponse, colleges]);

  const handleAdd = async () => {
    // In a real app, this would open a form dialog
    const name = prompt('Enter Student Name:');
    if (!name) return;
    try {
      await studentService.createStudent({
        id: 'temp-id',
        name,
        email: 'temp@email.com',
        collegeId: 'col-001',
        course: 'B.Tech',
        graduationYear: 2026,
        isPlaced: false,
      });
      refresh();
      showToast({
        title: 'Student Added',
        description: `${name} has been added.`,
        type: 'success',
      });
    } catch (e) {
      showToast({
        title: 'Error',
        description: 'Failed to add student.',
        type: 'error',
      });
    }
  };

  const handleEdit = async (student: Student) => {
    const name = prompt('Update Student Name:', student.name);
    if (!name || name === student.name) return;
    try {
      await studentService.updateStudent({ ...student, name });
      refresh();
      showToast({
        title: 'Student Updated',
        description: `${student.name} has been updated.`,
        type: 'success',
      });
    } catch (e) {
      showToast({
        title: 'Error',
        description: 'Failed to update student.',
        type: 'error',
      });
    }
  };

  const handleDelete = async (student: Student) => {
    if (!confirm(`Are you sure you want to delete ${student.name}?`)) return;
    try {
      await studentService.deleteStudent(student.studentId);
      refresh();
      showToast({
        title: 'Student Deleted',
        description: `${student.name} has been removed.`,
        type: 'success',
      });
    } catch (e) {
      showToast({
        title: 'Error',
        description: 'Failed to delete student.',
        type: 'error',
      });
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Student Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage campus recruitment students.
          </p>
        </div>
        <Button onClick={handleAdd}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Student
        </Button>
      </div>
      <DataTable
        columns={studentColumns(colleges || [], handleEdit, handleDelete)}
        data={studentsWithCollege}
        isLoading={isLoading}
        error={error}
        query={query}
        setQuery={setQuery}
        totalCount={studentsResponse?.total || 0}
        totalPages={studentsResponse?.totalPages || 1}
        selectable={false}
        selectedRows={{}}
        onSelectionChange={() => {}}
      />
    </div>
  );
}
