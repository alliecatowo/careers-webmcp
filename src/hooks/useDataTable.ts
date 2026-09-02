'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRequest } from '@/lib/request/useRequest';
import { TableQuery, PaginatedResponse } from '@/components/system/DataTable/types';

interface UseDataTableProps<T> {
    fetchData: (query: TableQuery) => Promise<PaginatedResponse<T>>;
    initialQuery?: Partial<TableQuery>;
}

export function useDataTable<T extends { id: string }>({
    fetchData,
    initialQuery,
}: UseDataTableProps<T>) {
    const [query, setQuery] = useState<TableQuery>({
        page: 1,
        limit: 10,
        search: '',
        ...initialQuery,
    });
    
    const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});

    // Memoize the fetchData function with the current query
    const memoizedFetch = useCallback(() => fetchData(query), [fetchData, query]);

    const { execute, data, error, isLoading } = useRequest(memoizedFetch);
    
    useEffect(() => {
        execute();
    }, [execute]);

    const refresh = useCallback(() => {
        execute();
    }, [execute]);
    
    const toggleRow = (rowId: string) => {
        setSelectedRows(prev => {
            const newSelected = { ...prev };
            if (newSelected[rowId]) {
                delete newSelected[rowId];
            } else {
                newSelected[rowId] = true;
            }
            return newSelected;
        });
    };

    const toggleAll = () => {
        if (!data) return;
        const allOnPageSelected = data.data.every(row => selectedRows[row.id]);

        if (allOnPageSelected) {
            // Deselect all on this page
            const newSelected = { ...selectedRows };
            data.data.forEach(row => delete newSelected[row.id]);
            setSelectedRows(newSelected);
        } else {
            // Select all on this page
            const newSelected = { ...selectedRows };
            data.data.forEach(row => newSelected[row.id] = true);
            setSelectedRows(newSelected);
        }
    };
    
    const clearSelection = () => {
        setSelectedRows({});
    };

    const handleSelectionChange = ({ action, rowId }: { action: 'toggle' | 'toggleAll', rowId?: string }) => {
        if (action === 'toggle' && rowId) {
            toggleRow(rowId);
        } else if (action === 'toggleAll') {
            toggleAll();
        }
    };

    return {
        data,
        error,
        isLoading,
        query,
        setQuery,
        selectedRows,
        toggleRow,
        toggleAll,
        clearSelection,
        handleSelectionChange,
        refresh,
    };
}
