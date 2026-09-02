import { Metadata } from 'next';
import { Suspense } from 'react';
import { ProjectFilters } from "@/modules/projects/components/ProjectFilters";
import { ProjectList, ProjectListSkeleton } from "@/modules/projects/components/ProjectList";

export const metadata: Metadata = {
  title: 'Project Marketplace',
  description:
    'Browse the Baalvion project marketplace. Find your next challenge, collaborate with global talent, and get paid for your skills.',
  alternates: {
    canonical: '/projects',
  },
  openGraph: {
    title: 'Project Marketplace | TalentOS by Baalvion',
    description:
      'Browse the Baalvion project marketplace. Find your next challenge and get paid for your skills.',
    url: '/projects',
  },
};

// These are now just default values; the components will control their state via URL params
const categories = ["All", "AI/ML", "Web", "Backend"];
const skills = ["All", "Python", "TensorFlow", "NLP", "React", "Node.js", "CSS", "PyTorch", "Chart.js", "Socket.io", "Next.js", "Tailwind", "Firebase", "Scikit-learn"];
const statuses = ["All", "OPEN", "ACTIVE", "COMPLETED", "DRAFT", "GOVERNANCE_REVIEW"];


function ProjectsPageContent() {
    return (
        <div className="container mx-auto py-12 px-4">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight">Project Marketplace</h1>
                <p className="mt-2 text-lg text-muted-foreground">Find your next challenge and get paid for your skills.</p>
            </div>
            <ProjectFilters categories={categories} skills={skills} statuses={statuses} />
            <Suspense fallback={<ProjectListSkeleton />}>
                <ProjectList initialProjects={[]} />
            </Suspense>
        </div>
    );
}

export default function PublicProjectsPage() {
    return (
        <Suspense fallback={<ProjectListSkeleton />}>
            <ProjectsPageContent />
        </Suspense>
    );
}
