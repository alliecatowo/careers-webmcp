'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StageHistory } from '@/types';
import { getStageLabel } from '@/lib/candidate/statusEngine';
import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ApplicationTimelineProps {
    stageHistory: StageHistory[];
    currentStage: string;
}

export function ApplicationTimeline({ stageHistory, currentStage }: ApplicationTimelineProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Application Timeline</CardTitle>
            </CardHeader>
            <CardContent>
                <ol className="relative border-l border-gray-200 dark:border-gray-700">
                    {stageHistory.map((item, index) => (
                        <li key={item.id} className="mb-10 ml-6">
                            <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                                <CheckCircle className="w-4 h-4 text-blue-800 dark:text-blue-300" />
                            </span>
                            <h3 className="flex items-center mb-1 text-base font-semibold text-gray-900 dark:text-white">
                                {getStageLabel(item.stage)}
                            </h3>
                            <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                                {new Date(item.timestamp).toLocaleDateString()}
                            </time>
                        </li>
                    ))}
                </ol>
            </CardContent>
        </Card>
    );
}
