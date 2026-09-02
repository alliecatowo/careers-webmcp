'use client';

import { Input } from "@/components/ui/input";
import { TableQuery } from "./types";
import { useDebounce } from "use-debounce";

interface DataTableToolbarProps {
    query: TableQuery;
    setQuery: React.Dispatch<React.SetStateAction<TableQuery>>;
    selectedRowCount: number;
    bulkActions?: React.ReactNode;
}

export function DataTableToolbar({ query, setQuery, selectedRowCount, bulkActions }: DataTableToolbarProps) {
    const [debouncedSearch] = useDebounce(query.search, 300);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(prev => ({ ...prev, search: event.target.value, page: 1 }));
    };

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder="Search..."
                    value={query.search}
                    onChange={handleSearchChange}
                    className="h-9 w-full md:w-[250px] lg:w-[300px]"
                />
                {/* Additional filter components can go here */}
            </div>
            {selectedRowCount > 0 ? (
                 <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{selectedRowCount} selected</span>
                    {bulkActions}
                </div>
            ) : null}
        </div>
    );
}
