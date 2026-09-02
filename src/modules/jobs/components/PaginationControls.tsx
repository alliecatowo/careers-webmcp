'use client';

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
    page: number;
    setPage: (page: number) => void;
    totalPages: number;
    totalItems: number;
    itemsCount: number;
    limit: number;
}

export function PaginationControls({ page, setPage, totalPages, totalItems, itemsCount, limit }: PaginationControlsProps) {
    if (totalItems === 0) return null;
    
    const startItem = (page - 1) * limit + 1;
    const endItem = startItem + itemsCount - 1;

    return (
        <div className="flex items-center justify-between pt-4">
            <div className="text-sm text-muted-foreground">
                Showing <strong>{startItem} - {endItem}</strong> of <strong>{totalItems}</strong> jobs.
            </div>
            <div className="flex items-center gap-4">
                <div className="text-sm font-medium">
                    Page {page} of {totalPages}
                </div>
                 <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page <= 1}
                        onClick={() => setPage(page - 1)}
                    >
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page >= totalPages}
                        onClick={() => setPage(page + 1)}
                    >
                        Next
                        <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
