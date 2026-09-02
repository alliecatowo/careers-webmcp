'use client';

import { DataColumn } from "@/components/system/DataTable";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ApplicationMatch } from '../types/campus.types';

const statusStyles = {
    Placed: "bg-green-100 text-green-800",
    Interview: "bg-yellow-100 text-yellow-800",
    Rejected: "bg-red-100 text-red-800",
    Applied: "bg-blue-100 text-blue-800",
};

export const AIMatchingColumns: DataColumn<ApplicationMatch>[] = [
    { key: 'studentName', header: 'Student', sortable: true },
    { key: 'jobTitle', header: 'Matched Job', sortable: true },
    { 
        key: 'score', 
        header: 'AI Match Score', 
        sortable: true,
        align: 'center',
        render: (row) => (
            <div className="flex items-center gap-2">
                <Progress value={row.score} className="w-24" />
                <span>{row.score}%</span>
            </div>
        )
    },
    { 
        key: 'status', 
        header: 'Suggested Status',
        render: (row) => (
            <Badge className={statusStyles[row.status]}>{row.status}</Badge>
        )
    },
];
