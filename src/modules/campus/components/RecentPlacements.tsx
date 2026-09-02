'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Student } from "@/modules/students/domain/student.entity";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import useSWR from 'swr';
import { campusService } from "@/services/campus.service";

export function RecentPlacements() {
    const { data: placements, isLoading } = useSWR('recentPlacements', () => campusService.getRecentPlacements(5));

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Placements</CardTitle>
                <CardDescription>Latest students who have been placed.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex justify-center items-center h-48">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : !placements || placements.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No recent placements.</p>
                ) : (
                    <div className="space-y-4">
                        {placements.map(student => (
                            <div key={student.studentId} className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Avatar>
                                        <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{student.name}</p>
                                        <p className="text-sm text-muted-foreground">{student.course}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" asChild>
                                    <Link href={`/campus/students`}>
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
