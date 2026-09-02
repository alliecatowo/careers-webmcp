'use client';

import { useState, useEffect } from 'react';
import { notFound, useParams } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { projectService } from '@/services/service';
import {
  Project,
  ProjectMilestone,
  ProjectTeamMember,
  User,
} from '@/types/contracts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/utils/currency';
import { ApplyDialog } from '@/modules/applications/components/ApplyDialog';
import { CreateTeamDialog } from '@/modules/teams/components/CreateTeamDialog';
import { Check, Clock, DollarSign, Users, UserPlus } from 'lucide-react';

function ProjectDetailSkeleton() {
  return (
    <div className="container mx-auto py-12">
      <header className="mb-12 space-y-4">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-6 w-full max-w-2xl" />
        <div className="flex items-center gap-6">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-24" />
        </div>
      </header>
      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
        <aside className="lg:col-span-1 space-y-6">
          <Skeleton className="h-56 w-full" />
        </aside>
      </div>
    </div>
  );
}

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.projectId as string;

  const { user: currentUser } = useAuthStore();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    projectService.getById(projectId).then((response) => {
      if (response.success && response.data) {
        setProject(response.data);
      } else {
        setProject(null);
      }
      setIsLoading(false);
    });
  }, [projectId]);

  const toggleMilestone = (milestoneId: string) => {
    setProject((prevProject) => {
      if (!prevProject || !prevProject.milestones) return prevProject;
      const updatedMilestones = prevProject.milestones.map((ms) =>
        ms.id === milestoneId
          ? {
              ...ms,
              status: (ms.status === 'completed' ? 'pending' : 'completed') as
                | 'pending'
                | 'completed',
            }
          : ms,
      );
      return { ...prevProject, milestones: updatedMilestones };
    });
  };

  const assignRole = (roleToAssign: string) => {
    setProject((prevProject) => {
      if (!prevProject || !prevProject.teams || !currentUser)
        return prevProject;
      const teamIndex = prevProject.teams.findIndex(
        (t) => t.role === roleToAssign && t.member === null,
      );
      if (teamIndex === -1) return prevProject;

      const updatedTeams = [...prevProject.teams];
      updatedTeams[teamIndex] = {
        ...updatedTeams[teamIndex],
        member: currentUser.fullName || null,
      };

      return { ...prevProject, teams: updatedTeams };
    });
  };

  if (isLoading) return <ProjectDetailSkeleton />;
  if (!project) return notFound();

  const completedMilestones =
    project.milestones?.filter((m) => m.status === 'completed').length || 0;
  const totalMilestones = project.milestones?.length || 1;
  const progressPercent = Math.round(
    (completedMilestones / totalMilestones) * 100,
  );
  const mockPayoutPerMilestone = project.budget / totalMilestones;
  const earnedPayout = completedMilestones * mockPayoutPerMilestone;

  return (
    <>
      <div className="bg-muted/40">
        <div className="container mx-auto py-12">
          <header className="mb-12">
            <Badge variant="outline" className="mb-2">
              {project.category}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              {project.title}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
              {project.description}
            </p>
            <div className="mt-6 flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" /> Ends on{' '}
                {new Date(project.endDate).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" /> Up to {project.maxTeamSize}{' '}
                members
              </div>
              <Badge variant="secondary">{project.status}</Badge>
            </div>
          </header>

          <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Project Milestones</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {project.milestones?.map((ms) => (
                    <div
                      key={ms.id}
                      className="flex items-center space-x-3 p-3 rounded-md bg-muted/50"
                    >
                      <Checkbox
                        id={`ms-${ms.id}`}
                        checked={ms.status === 'completed'}
                        onCheckedChange={() => toggleMilestone(ms.id)}
                      />
                      <label
                        htmlFor={`ms-${ms.id}`}
                        className={`text-sm font-medium leading-none ${
                          ms.status === 'completed'
                            ? 'line-through text-muted-foreground'
                            : ''
                        }`}
                      >
                        {ms.title}
                      </label>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Team Roles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {project.teams?.map((teamMember) => (
                    <div
                      key={teamMember.role}
                      className="flex items-center justify-between p-3 rounded-md border"
                    >
                      <p className="font-semibold">{teamMember.role}</p>
                      {teamMember.member ? (
                        <Badge
                          variant="secondary"
                          className="flex items-center gap-2"
                        >
                          <Check className="h-4 w-4" /> {teamMember.member}
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => assignRole(teamMember.role)}
                        >
                          <UserPlus className="mr-2 h-4 w-4" />
                          Assign Me
                        </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <aside className="lg:col-span-1 space-y-6 lg:sticky top-24">
              <Card>
                <CardHeader>
                  <CardTitle>Project Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <Progress value={progressPercent} className="mb-2" />
                  <p className="text-sm text-center font-semibold">
                    {progressPercent}% Completed
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Mock Payout</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-6 w-6 text-green-500" />
                    <p className="text-2xl font-bold">
                      {formatCurrency(earnedPayout, 'USD')}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Earned from {completedMilestones} completed milestones.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={() => setIsApplyOpen(true)}
                  >
                    Apply for Role
                  </Button>
                  <Button
                    size="lg"
                    variant="secondary"
                    className="w-full"
                    onClick={() => setIsCreateTeamOpen(true)}
                  >
                    Create a Team
                  </Button>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </div>
      {isApplyOpen && project && (
        <ApplyDialog
          isOpen={isApplyOpen}
          onClose={() => setIsApplyOpen(false)}
          project={project}
        />
      )}
      {isCreateTeamOpen && project && (
        <CreateTeamDialog
          isOpen={isCreateTeamOpen}
          onClose={() => setIsCreateTeamOpen(false)}
          project={project}
        />
      )}
    </>
  );
}
