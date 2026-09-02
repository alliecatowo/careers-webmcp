'use client';

import { DataColumn } from "@/components/system/DataTable";
import { Student } from "../domain/student.entity";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { College } from "@/mocks/colleges.mock";

export const studentColumns = (
    colleges: College[],
    onEdit: (student: Student) => void,
    onDelete: (student: Student) => void
): DataColumn<Student & { collegeName?: string }>[] => [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'email', header: 'Email', sortable: true },
    { 
        key: 'collegeName', 
        header: 'College', 
        sortable: true,
    },
    { key: 'course', header: 'Course' },
    { key: 'graduationYear', header: 'Graduation Year', align: 'center' },
    { 
        key: 'isPlaced', 
        header: 'Status', 
        render: (row) => (
            <Badge variant={row.isPlaced ? 'default' : 'destructive'} className={row.isPlaced ? 'bg-green-100 text-green-800' : ''}>
                {row.isPlaced ? 'Placed' : 'Not Placed'}
            </Badge>
        )
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => onEdit(row)}>Edit</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(row)} className="text-destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      )
    }
];
