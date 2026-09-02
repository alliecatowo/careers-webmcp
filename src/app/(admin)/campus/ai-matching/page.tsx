
'use client';

import { useDataTable } from '@/hooks/useDataTable';
import { DataTable } from '@/components/system/DataTable';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/system/Toast/useToast';
import { campusService } from '@/services/campus.service';
import { ApplicationMatch } from '@/modules/campus/types/campus.types';
import { AIMatchingColumns } from '@/modules/campus/components/AIMatchingColumns';
import { Sparkles } from 'lucide-react';

export default function AIMatchingPage() {
    const { showToast } = useToast();
    const {
        data,
        error,
        isLoading,
        query,
        setQuery,
        refresh,
    } = useDataTable<ApplicationMatch>({
        fetchData: campusService.getAIMatches,
    });

    const handleRunAI = () => {
        refresh();
        showToast({ title: 'AI Matching Completed', description: 'Scores and statuses have been updated.', type: 'success' });
    };
    
    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">AI Candidate-Job Matching</h1>
                    <p className="text-muted-foreground">Automatically score and suggest placements for students.</p>
                </div>
                <Button onClick={handleRunAI}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Run AI Matching
                </Button>
            </div>
            <DataTable
                columns={AIMatchingColumns}
                data={data?.data || []}
                isLoading={isLoading}
                error={error}
                query={query}
                setQuery={setQuery}
                totalCount={data?.total || 0}
                totalPages={data?.totalPages || 1}
                selectable={false}
                selectedRows={{}}
                onSelectionChange={() => {}}
            />
        </div>
    );
}
