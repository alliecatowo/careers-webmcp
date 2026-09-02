
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Project, ProjectStatus } from '../domain/project.entity';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils/currency';
import { ArrowUpRight } from 'lucide-react';

const statusStyles: Record<ProjectStatus, string> = {
    OPEN: "border-blue-500 text-blue-500",
    ACTIVE: "border-green-500 text-green-500",
    COMPLETED: "border-gray-500 text-gray-500",
    DRAFT: "border-yellow-500 text-yellow-500",
    GOVERNANCE_REVIEW: "border-purple-500 text-purple-500",
};

export function ProjectCard({ project }: { project: Project }) {
    return (
        <Card className="flex flex-col h-full hover:border-primary transition-colors relative group">
            <CardHeader>
                <div className="flex justify-between items-start gap-4">
                    <CardTitle className="text-xl pr-12">
                        {project.title}
                    </CardTitle>
                    <Badge variant="outline" className={statusStyles[project.status]}>
                        {project.status.replace('_', ' ')}
                    </Badge>
                </div>
                <CardDescription>{project.category}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-3">{project.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                    {project.requiredSkills.slice(0, 4).map(skill => (
                        <Badge key={skill} variant="secondary">{skill}</Badge>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="flex justify-between items-end">
                <div>
                    <p className="text-xs text-muted-foreground">Budget</p>
                    <p className="text-lg font-bold">{formatCurrency(project.budget, project.currency)}</p>
                </div>
                <div className="text-xs text-muted-foreground">
                    by {project.owner}
                </div>
            </CardFooter>
            <Link href={`/projects/${project.id}`} className="absolute inset-0">
                <span className="sr-only">View project {project.title}</span>
            </Link>
             <ArrowUpRight className="absolute top-4 right-4 h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
        </Card>
    );
}
