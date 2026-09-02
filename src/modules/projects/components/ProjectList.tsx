
'use client';
import { useSearchParams } from "next/navigation";
import { useProjects } from "../hooks/useProjects";
import { ProjectCard } from "./ProjectCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ProjectListSkeleton() {
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="flex flex-col">
                    <CardContent className="p-6 space-y-4">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-12 w-full" />
                        <div className="flex gap-2">
                            <Skeleton className="h-6 w-20" />
                            <Skeleton className="h-6 w-20" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

interface ProjectListProps {
    initialProjects: any[];
}

export function ProjectList({ initialProjects }: ProjectListProps) {
    const searchParams = useSearchParams();
    const filters = {
        search: searchParams.get('search') || undefined,
        category: searchParams.get('category') || undefined,
        status: searchParams.get('status') || undefined,
        skill: searchParams.get('skill') || undefined,
    }
    const { projects, isLoading, isError } = useProjects(filters);

    if (isLoading) {
        return <ProjectListSkeleton />;
    }
    
    if (isError) {
        return (
             <Card>
                <CardContent className="p-12 text-center">
                    <h3 className="text-xl font-semibold text-destructive">Failed to Load Projects</h3>
                    <p className="mt-2 text-muted-foreground">There was an error fetching the projects. Please try again later.</p>
                </CardContent>
            </Card>
        );
    }
    
    const displayProjects = projects || initialProjects;

    if (displayProjects.length === 0) {
        return (
            <Card>
                <CardContent className="p-12 text-center">
                    <h3 className="text-xl font-semibold">No Matching Projects Found</h3>
                    <p className="mt-2 text-muted-foreground">Please try adjusting your filters.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayProjects.map(project => (
                <ProjectCard key={project.id} project={project} />
            ))}
        </div>
    );
}

ProjectList.Skeleton = ProjectListSkeleton;
