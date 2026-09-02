'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle } from 'lucide-react';
import { DataTablePagination } from './DataTablePagination';
import { DataTableToolbar } from './DataTableToolbar';
import { DataColumn, TableQuery } from './types';
import { Checkbox } from '@/components/ui/checkbox';
import { AppError } from '@/lib/errors/error.types';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useTenant } from '@/context/TenantContext';
import { canPerformAction } from '@/lib/access/permission.evaluator';
import { PermissionContext } from '@/lib/access/permission.context';

interface DataTableProps<T extends { id: string }> {
  columns: DataColumn<T>[];
  data: T[];
  isLoading: boolean;
  error?: AppError;
  query: TableQuery;
  setQuery: React.Dispatch<React.SetStateAction<TableQuery>>;
  totalCount: number;
  totalPages: number;
  selectable?: boolean;
  selectedRows: Record<string, boolean>;
  onSelectionChange: (params: { action: 'toggle' | 'toggleAll', rowId?: string }) => void;
  bulkActions?: React.ReactNode;
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  isLoading,
  error,
  query,
  setQuery,
  totalCount,
  totalPages,
  selectable = false,
  selectedRows,
  onSelectionChange,
  bulkActions,
}: DataTableProps<T>) {
  const { user } = useAuth();
  const { currentOrganization } = useTenant();

  const visibleColumns = React.useMemo(() => {
    if (!user || !currentOrganization) {
      return columns.filter(col => !col.permission);
    }
    
    const context: PermissionContext = {
      userId: user.id,
      userRole: user.role,
      tenantId: currentOrganization.id
    };

    return columns.filter(col => {
      if (!col.permission) {
        return true;
      }
      return canPerformAction(context, col.permission as any);
    });
  }, [columns, user, currentOrganization]);

  const handleSort = (key: string) => {
    if (!key) return;
    setQuery(prev => ({
      ...prev,
      page: 1,
      sortBy: key,
      sortOrder: prev.sortBy === key && prev.sortOrder === 'asc' ? 'desc' : 'asc',
    }));
  };
  
  const selectedRowCount = Object.keys(selectedRows).length;
  const isAllOnPageSelected = data.length > 0 && data.every(row => selectedRows[row.id]);

  const renderLoadingState = () => (
    <TableBody>
      {Array.from({ length: query.limit }).map((_, i) => (
        <TableRow key={i}>
          {selectable && (
            <TableCell className="w-[50px]">
              <Skeleton className="h-4 w-4" />
            </TableCell>
          )}
          {visibleColumns.map(col => (
            <TableCell key={String(col.key)}>
              <Skeleton className="h-5 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );

  const renderErrorState = () => (
    <TableRow>
      <TableCell colSpan={visibleColumns.length + (selectable ? 1 : 0)} className="h-24 text-center">
        <div className="flex flex-col items-center justify-center gap-2 text-destructive">
          <AlertTriangle className="h-6 w-6" />
          <span className="font-semibold">{error?.message || 'Failed to load data.'}</span>
        </div>
      </TableCell>
    </TableRow>
  );

  const renderEmptyState = () => (
    <TableRow>
      <TableCell colSpan={visibleColumns.length + (selectable ? 1 : 0)} className="h-24 text-center text-muted-foreground">
        No results found.
      </TableCell>
    </TableRow>
  );

  return (
    <div className="space-y-4">
       <DataTableToolbar
            query={query}
            setQuery={setQuery}
            selectedRowCount={selectedRowCount}
            bulkActions={bulkActions}
        />
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              {selectable && (
                <TableHead className="w-[50px]">
                   <Checkbox
                        checked={isAllOnPageSelected}
                        onCheckedChange={() => onSelectionChange({ action: 'toggleAll' })}
                        aria-label="Select all rows on this page"
                    />
                </TableHead>
              )}
              {visibleColumns.map(col => (
                <TableHead key={String(col.key)} style={{ width: col.width }} className={`text-${col.align || 'left'}`}>
                  {col.sortable ? (
                    <Button variant="ghost" onClick={() => handleSort(String(col.key))}>
                      {col.header}
                      {query.sortBy === col.key && (query.sortOrder === 'asc' ? ' ▲' : ' ▼')}
                    </Button>
                  ) : (
                    col.header
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
            {isLoading ? (
                renderLoadingState()
            ) : error ? (
                <TableBody>{renderErrorState()}</TableBody>
            ) : data.length > 0 ? (
                <TableBody>
                {data.map(row => (
                    <TableRow key={row.id} data-state={selectedRows[row.id] && "selected"}>
                    {selectable && (
                        <TableCell>
                           <Checkbox
                                checked={!!selectedRows[row.id]}
                                onCheckedChange={() => onSelectionChange({ action: 'toggle', rowId: row.id })}
                                aria-label={`Select row ${row.id}`}
                            />
                        </TableCell>
                    )}
                    {visibleColumns.map(col => (
                        <TableCell key={String(col.key)} className={`text-${col.align || 'left'}`}>
                        {col.render ? col.render(row) : (row as any)[col.key]}
                        </TableCell>
                    ))}
                    </TableRow>
                ))}
                </TableBody>
            ) : (
                <TableBody>{renderEmptyState()}</TableBody>
            )}
        </Table>
      </div>
      <DataTablePagination
        query={query}
        setQuery={setQuery}
        totalCount={totalCount}
        totalPages={totalPages}
      />
    </div>
  );
}
