import { Permission } from '@/lib/access/access.types';
import React from 'react';

export interface DataColumn<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  render?: (row: T) => React.ReactNode;
  permission?: Permission;
  align?: 'left' | 'center' | 'right';
}

export interface TableQuery {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
  search?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
