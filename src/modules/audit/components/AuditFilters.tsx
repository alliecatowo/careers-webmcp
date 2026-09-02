'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { AuditLogFiltersState } from '@/app/(admin)/audit-logs/page';

interface AuditFiltersProps {
    onFilterChange: (filters: AuditLogFiltersState) => void;
}

const entityTypes = ['candidate', 'job', 'user', 'application', 'offer', 'system', 'unknown'];

export function AuditFilters({ onFilterChange }: AuditFiltersProps) {
    const [filters, setFilters] = useState<AuditLogFiltersState>({});

    const handleInputChange = (field: keyof AuditLogFiltersState, value: any) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const handleDateChange = (field: 'startDate' | 'endDate', value: Date | undefined) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };
    
    const handleApply = () => {
        const cleanFilters: AuditLogFiltersState = {};
        if (filters.actorId) cleanFilters.actorId = filters.actorId;
        if (filters.action) cleanFilters.action = filters.action;
        if (filters.entityType) cleanFilters.entityType = filters.entityType;
        if (filters.startDate) cleanFilters.startDate = filters.startDate;
        if (filters.endDate) cleanFilters.endDate = filters.endDate;
        onFilterChange(cleanFilters);
    };

    const handleClear = () => {
        setFilters({});
        onFilterChange({});
    };

    return (
        <div className="p-4 bg-card border rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 items-end">
                <div className="space-y-2">
                    <Label htmlFor="actorId">Actor ID</Label>
                    <Input
                        id="actorId"
                        placeholder="Filter by actor ID"
                        value={filters.actorId || ''}
                        onChange={(e) => handleInputChange('actorId', e.target.value)}
                    />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="action">Action</Label>
                    <Input
                        id="action"
                        placeholder="Filter by action type"
                        value={filters.action || ''}
                        onChange={(e) => handleInputChange('action', e.target.value)}
                    />
                </div>
                 <div className="space-y-2">
                    <Label>Entity Type</Label>
                    <Select
                        value={filters.entityType || ''}
                        onValueChange={(value) => handleInputChange('entityType', value === 'all' ? '' : value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="All Entity Types" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Entity Types</SelectItem>
                            {entityTypes.map(type => (
                                <SelectItem key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Start Date</Label>
                     <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !filters.startDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {filters.startDate ? format(filters.startDate, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={filters.startDate}
                            onSelect={(date) => handleDateChange('startDate', date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                </div>
                 <div className="space-y-2">
                    <Label>End Date</Label>
                     <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !filters.endDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {filters.endDate ? format(filters.endDate, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={filters.endDate}
                            onSelect={(date) => handleDateChange('endDate', date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
                <Button onClick={handleClear} variant="ghost">Clear</Button>
                <Button onClick={handleApply}>Apply Filters</Button>
            </div>
        </div>
    );
}
