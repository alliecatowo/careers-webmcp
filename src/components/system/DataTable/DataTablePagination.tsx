'use client';

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TableQuery } from "./types";

interface DataTablePaginationProps {
    query: TableQuery;
    setQuery: React.Dispatch<React.SetStateAction<TableQuery>>;
    totalPages: number;
    totalCount: number;
}

export function DataTablePagination({ query, setQuery, totalPages, totalCount }: DataTablePaginationProps) {
    const handlePageChange = (newPage: number) => {
        setQuery(prev => ({ ...prev, page: newPage }));
    };

    const handleLimitChange = (newLimit: string) => {
        setQuery(prev => ({ ...prev, limit: Number(newLimit), page: 1 }));
    };
    
    if (totalCount === 0) return null;

    return (
        <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
                Total {totalCount} records.
            </div>
            <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">Rows per page</p>
                    <Select
                        value={`${query.limit}`}
                        onValueChange={handleLimitChange}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={query.limit} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[10, 20, 30, 40, 50].map((pageSize) => (
                                <SelectItem key={pageSize} value={`${pageSize}`}>{pageSize}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="text-sm font-medium">
                    Page {query.page} of {totalPages}
                </div>
                 <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={query.page === 1}
                        onClick={() => handlePageChange(query.page - 1)}
                    >
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={query.page >= totalPages}
                        onClick={() => handlePageChange(query.page + 1)}
                    >
                        Next
                        <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
