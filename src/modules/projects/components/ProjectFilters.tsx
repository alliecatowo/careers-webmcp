
'use client';
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProjectStatus } from "../domain/project.entity";
import { Search } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

interface ProjectFiltersProps {
    categories: string[];
    skills: string[];
    statuses: string[];
}

export function ProjectFilters({ categories, skills, statuses }: ProjectFiltersProps) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleFilterChange = useDebouncedCallback((key: string, value: string) => {
        const params = new URLSearchParams(searchParams);
        if (value && value.toLowerCase() !== 'all') {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        params.set('page', '1');
        replace(`${pathname}?${params.toString()}`);
    }, 300);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            <div className="relative md:col-span-2 lg:col-span-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    placeholder="Search by title, category, or description..."
                    className="pl-10"
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    defaultValue={searchParams.get('search') || ''}
                />
            </div>
            <Select onValueChange={(value) => handleFilterChange('category', value)} defaultValue={searchParams.get('category') || 'All'}>
                <SelectTrigger><SelectValue placeholder="Filter by category" /></SelectTrigger>
                <SelectContent>
                    {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                </SelectContent>
            </Select>
            <Select onValueChange={(value) => handleFilterChange('status', value)} defaultValue={searchParams.get('status') || 'All'}>
                <SelectTrigger><SelectValue placeholder="Filter by status" /></SelectTrigger>
                <SelectContent>
                    {statuses.map(stat => <SelectItem key={stat} value={stat}>{stat.replace('_', ' ')}</SelectItem>)}
                </SelectContent>
            </Select>
            <Select onValueChange={(value) => handleFilterChange('skill', value)} defaultValue={searchParams.get('skill') || 'All'}>
                <SelectTrigger><SelectValue placeholder="Filter by skill" /></SelectTrigger>
                <SelectContent>
                    {skills.map(skill => <SelectItem key={skill} value={skill}>{skill}</SelectItem>)}
                </SelectContent>
            </Select>
        </div>
    );
}
