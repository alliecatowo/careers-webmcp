'use client';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { jobStatuses } from "@/types/workflow.types";
import React from 'react';
import { Department } from "@/lib/talent-acquisition";
import { AdminJobsQueryParams } from "../jobs.hooks";

type JobsFiltersProps = {
    filters: Omit<AdminJobsQueryParams, 'page' | 'limit'>;
    setFilters: React.Dispatch<React.SetStateAction<Omit<AdminJobsQueryParams, 'page' | 'limit'>>>;
    allDepartments: Department[];
};

export function JobsFilters({ filters, setFilters, allDepartments }: JobsFiltersProps) {
    const handleFilterChange = (key: keyof typeof filters, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };
    
    const uniqueDepartments = React.useMemo(() => ['all', ...allDepartments.map(dept => dept.name)], [allDepartments]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
                placeholder="Search by job title..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="md:col-span-1"
            />
             <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value === 'all' ? '' : value)}>
                <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {jobStatuses.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
                </SelectContent>
            </Select>
            <Select value={filters.department} onValueChange={(value) => handleFilterChange('department', value === 'all' ? '' : value)}>
                <SelectTrigger>
                    <SelectValue placeholder="Filter by department" />
                </SelectTrigger>
                <SelectContent>
                     {uniqueDepartments.map(dept => <SelectItem key={dept} value={dept}>{dept === 'all' ? 'All Departments' : dept}</SelectItem>)}
                </SelectContent>
            </Select>
        </div>
    );
}
