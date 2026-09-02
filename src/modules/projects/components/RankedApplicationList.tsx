
'use client';
import { useState } from 'react';
import { DataTable, DataColumn } from '@/components/system/DataTable';
import { ProjectApplication, MatchScore, ReputationSummary } from '@/types/contracts';
import { mockUsers } from '@/services/mockData';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { useToast } from '@/components/system/Toast/useToast';

interface RankedApplicationListProps {
    applications: ProjectApplication[];
}

const getContractor = (id: string) => mockUsers.find(u => u.id === id);

const getTopMatchBadge = (rank?: number) => {
    if (rank === 1) return <Badge className="bg-green-100 text-green-800">Top Match</Badge>;
    if (rank && rank <= 3) return <Badge className="bg-blue-100 text-blue-800">High Potential</Badge>;
    return null;
}

export function RankedApplicationList({ applications }: RankedApplicationListProps) {
    const { showToast } = useToast();
    const [query, setQuery] = useState({ page: 1, limit: 10 });

    const handleAccept = (appName: string) => {
        showToast({ type: 'success', title: 'Contractor Selected!', description: `You have selected ${appName} for this project.` })
    }

    const columns: DataColumn<ProjectApplication>[] = [
        {
            key: 'rankingPosition',
            header: 'Rank',
            render: (row) => <div className="font-bold text-lg text-center">{row.matchScore?.rankingPosition}</div>,
            align: 'center'
        },
        {
            key: 'contractor',
            header: 'Contractor',
            render: (row) => {
                const contractor = getContractor(row.contractorId);
                return (
                    <div className="flex items-center gap-3">
                        <Avatar><AvatarImage src={contractor?.avatarUrl} /><AvatarFallback>{(contractor?.fullName || contractor?.name || '?').charAt(0)}</AvatarFallback></Avatar>
                        <div>
                            <p className="font-semibold">{contractor?.fullName || contractor?.name}</p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span>{contractor?.reputationSummary?.averageRating.toFixed(1)}</span>
                                <span>({contractor?.reputationSummary?.totalReviews} reviews)</span>
                            </div>
                        </div>
                    </div>
                )
            }
        },
        {
            key: 'finalScore',
            header: 'Match Score',
            render: (row) => (
                <div className="flex items-center gap-2">
                    <Progress value={row.matchScore?.finalScore} className="w-24" />
                    <span className="font-semibold">{row.matchScore?.finalScore}%</span>
                    {getTopMatchBadge(row.matchScore?.rankingPosition)}
                </div>
            )
        },
        {
            key: 'actions',
            header: 'Actions',
            align: 'right',
            render: (row) => (
                <div className="flex gap-2 justify-end">
                    <Button variant="outline" size="sm">View Profile</Button>
                    <Button size="sm" onClick={() => handleAccept(getContractor(row.contractorId)?.fullName || getContractor(row.contractorId)?.name || 'the contractor')}>Select Contractor</Button>
                </div>
            )
        }
    ];

    return (
        <DataTable
            columns={columns}
            data={applications}
            isLoading={false}
            query={query}
            setQuery={setQuery}
            totalCount={applications.length}
            totalPages={Math.ceil(applications.length / query.limit)}
            onSelectionChange={() => { }}
            selectedRows={{}}
        />
    )
}
