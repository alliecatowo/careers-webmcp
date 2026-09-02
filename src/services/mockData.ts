
import { User, Project, Team, ProjectApplication, Invitation, TeamStatus, ProjectStatus, Role, Milestone, ReputationSummary, ProjectReview, ProjectMilestone, ProjectTeamMember } from '@/types/contracts';

// --- USERS ---
export const mockUsers: User[] = [
    {
        id: "user_6b82f",
        name: "John Smith",
        fullName: "John Smith",
        email: "john@example.com",
        avatarUrl: "https://i.pravatar.cc/150?u=john",
        role: "CONTRACTOR",
        isActive: true,
        createdAt: "2023-01-15T00:00:00Z",
        updatedAt: "2024-03-01T00:00:00Z",
        skills: ["React", "TypeScript", "Node.js"], reputationSummary: { userId: 'user_6b82f', averageRating: 4.5, totalReviews: 10, completedProjects: 8, lastUpdated: new Date().toISOString() }
    },
    {
        id: "user_a1b2c",
        name: "Sarah Jenkins",
        fullName: "Sarah Jenkins",
        email: "sarah@example.com",
        avatarUrl: "https://i.pravatar.cc/150?u=sarah",
        role: "CONTRACTOR",
        isActive: true,
        createdAt: "2023-05-20T00:00:00Z",
        updatedAt: "2024-02-15T00:00:00Z",
        skills: ["UI/UX", "Figma", "Tailwind CSS"], reputationSummary: { userId: 'user_a1b2c', averageRating: 4.8, totalReviews: 15, completedProjects: 12, lastUpdated: new Date().toISOString() }
    },
    {
        id: "user_9x8y7",
        name: "Michael Chang",
        fullName: "Michael Chang",
        email: "michael@example.com",
        avatarUrl: "https://i.pravatar.cc/150?u=michael",
        role: "CONTRACTOR",
        isActive: true,
        createdAt: "2022-11-10T00:00:00Z",
        updatedAt: "2024-03-05T00:00:00Z",
        skills: ["Python", "Django", "PostgreSQL"], reputationSummary: { userId: 'user_9x8y7', averageRating: 4.2, totalReviews: 5, completedProjects: 4, lastUpdated: new Date().toISOString() }
    },
    {
        id: "client_1a2b",
        name: "TechCorp Inc.",
        fullName: "TechCorp Inc.",
        email: "contact@techcorp.com",
        avatarUrl: "https://i.pravatar.cc/150?u=techcorp",
        role: "CLIENT",
        isActive: true,
        createdAt: "2022-01-05T00:00:00Z",
        updatedAt: "2024-01-10T00:00:00Z",
        reputationSummary: { userId: 'client_1a2b', averageRating: 4.9, totalReviews: 20, completedProjects: 20, lastUpdated: new Date().toISOString() }
    },
];

// --- PROJECTS ---
export let mockProjects: Project[] = [
    { id: 'proj-1', title: 'AI Resume Parser', description: 'Build an AI-powered resume parsing tool.', category: 'AI/ML', status: 'OPEN', requiredSkills: ['Python', 'TensorFlow', 'NLP'], budget: 10000, owner: 'Baalvion Labs', currency: 'USD', startDate: '2026-03-01', endDate: '2026-03-15', maxTeamSize: 3, roles: [{ id: 'r1', name: 'Frontend Developer', description: '', capacity: 1, filledCount: 0 }, { id: 'r2', name: 'Backend Developer', description: '', capacity: 1, filledCount: 0 }, { id: 'r3', name: 'Designer', description: '', capacity: 1, filledCount: 0 }], milestones: [{ id: 'm1', title: 'Setup Repo', status: 'pending' }, { id: 'm2', title: 'Design UI', status: 'pending' }, { id: 'm3', title: 'Implement Core Features', status: 'pending' }], teams: [{ role: 'Frontend Developer', member: null }, { role: 'Backend Developer', member: null }, { role: 'Designer', member: null }], createdAt: new Date().toISOString(), clientId: 'u4' },
    { id: 'proj-2', title: 'Campus Portal', description: 'Create a university placement portal UI.', category: 'Web', status: 'ACTIVE', requiredSkills: ['React', 'Node.js', 'CSS'], budget: 8000, owner: 'Baalvion Campus', currency: 'USD', startDate: '2026-03-05', endDate: '2026-03-20', maxTeamSize: 3, roles: [{ id: 'r4', name: 'Frontend', description: '', capacity: 1, filledCount: 0 }, { id: 'r5', name: 'Backend', description: '', capacity: 1, filledCount: 0 }, { id: 'r6', name: 'Designer', description: '', capacity: 1, filledCount: 0 }], milestones: [{ id: 'm1', title: 'Setup Repo', status: 'pending' }, { id: 'm2', title: 'Design UI', status: 'pending' }, { id: 'm3', title: 'Implement Core Features', status: 'pending' }], teams: [{ role: 'Frontend', member: null }, { role: 'Backend', member: null }, { role: 'Designer', member: null }], createdAt: new Date().toISOString(), clientId: 'u4', assignedContractorId: 'u1' },
    { id: 'proj-3', title: 'Job Matching AI', description: 'AI system to match candidates to jobs.', category: 'AI/ML', status: 'OPEN', requiredSkills: ['Python', 'PyTorch', 'NLP'], budget: 15000, owner: 'Baalvion R&D', currency: 'USD', startDate: '2026-03-07', endDate: '2026-03-22', maxTeamSize: 2, roles: [{ id: 'r7', name: 'AI Developer', description: '', capacity: 1, filledCount: 0 }, { id: 'r8', name: 'Frontend', description: '', capacity: 1, filledCount: 0 }], milestones: [{ id: 'm1', title: 'Data Prep', status: 'pending' }, { id: 'm2', title: 'Model Training', status: 'pending' }, { id: 'm3', title: 'Integrate UI', status: 'pending' }], teams: [{ role: 'AI Developer', member: null }, { role: 'Frontend', member: null }], createdAt: new Date().toISOString(), clientId: 'u4' },
    { id: 'proj-4', title: 'Analytics Dashboard', description: 'Dashboard for hiring analytics.', category: 'Web', status: 'COMPLETED', requiredSkills: ['React', 'Chart.js', 'Node.js'], budget: 7000, owner: 'Baalvion Labs', currency: 'USD', startDate: '2026-03-10', endDate: '2026-03-25', maxTeamSize: 2, roles: [{ id: 'r9', name: 'Frontend', description: '', capacity: 1, filledCount: 0 }, { id: 'r10', name: 'Backend', description: '', capacity: 1, filledCount: 0 }], milestones: [{ id: 'm1', title: 'Design Charts', status: 'pending' }, { id: 'm2', title: 'Integrate API', status: 'pending' }, { id: 'm3', title: 'Finalize UI', status: 'pending' }], teams: [{ role: 'Frontend', member: null }, { role: 'Backend', member: null }], createdAt: new Date().toISOString(), clientId: 'u4', assignedContractorId: 'u2' },
    { id: 'proj-5', title: 'Notification Engine', description: 'System to send alerts and notifications.', category: 'Backend', status: 'ACTIVE', requiredSkills: ['Node.js', 'Socket.io', 'Redis'], budget: 5000, owner: 'Baalvion Labs', currency: 'USD', startDate: '2026-03-12', endDate: '2026-03-28', maxTeamSize: 2, roles: [{ id: 'r11', name: 'Frontend', description: '', capacity: 1, filledCount: 0 }, { id: 'r12', name: 'Backend', description: '', capacity: 1, filledCount: 0 }], milestones: [{ id: 'm1', title: 'Setup Backend', status: 'pending' }, { id: 'm2', title: 'Connect UI', status: 'pending' }, { id: 'm3', title: 'Test Notifications', status: 'pending' }], teams: [{ role: 'Frontend', member: null }, { role: 'Backend', member: null }], createdAt: new Date().toISOString(), clientId: 'u4' },
    { id: 'proj-6', title: 'Team Collaboration Tool', description: 'UI for team project management.', category: 'Web', status: 'OPEN', requiredSkills: ['React', 'Next.js', 'Tailwind'], budget: 12000, owner: 'Baalvion Labs', currency: 'USD', startDate: '2026-03-15', endDate: '2026-03-30', maxTeamSize: 3, roles: [{ id: 'r13', name: 'Frontend', description: '', capacity: 1, filledCount: 0 }, { id: 'r14', name: 'Backend', description: '', capacity: 1, filledCount: 0 }, { id: 'r15', name: 'Designer', description: '', capacity: 1, filledCount: 0 }], milestones: [{ id: 'm1', title: 'Design UI', status: 'pending' }, { id: 'm2', title: 'Integrate Backend', status: 'pending' }, { id: 'm3', title: 'Finalize Features', status: 'pending' }], teams: [{ role: 'Frontend', member: null }, { role: 'Backend', member: null }, { role: 'Designer', member: null }], createdAt: new Date().toISOString(), clientId: 'u4' },
    { id: 'proj-7', title: 'Resume Uploader', description: 'Frontend for candidate document upload.', category: 'Web', status: 'ACTIVE', requiredSkills: ['React', 'Firebase'], budget: 6000, owner: 'Baalvion Labs', currency: 'USD', startDate: '2026-03-18', endDate: '2026-04-02', maxTeamSize: 2, roles: [{ id: 'r16', name: 'Frontend', description: '', capacity: 1, filledCount: 0 }, { id: 'r17', name: 'Backend', description: '', capacity: 1, filledCount: 0 }], milestones: [{ id: 'm1', title: 'File Upload UI', status: 'pending' }, { id: 'm2', title: 'Mock Storage', status: 'pending' }, { id: 'm3', title: 'Test Upload', status: 'pending' }], teams: [{ role: 'Frontend', member: null }, { role: 'Backend', member: null }], createdAt: new Date().toISOString(), clientId: 'u4' },
    { id: 'proj-8', title: 'Campus AI Matching', description: 'AI matching for student placement.', category: 'AI/ML', status: 'OPEN', requiredSkills: ['Python', 'TensorFlow', 'Scikit-learn'], budget: 14000, owner: 'Baalvion Campus', currency: 'USD', startDate: '2026-03-20', endDate: '2026-04-05', maxTeamSize: 2, roles: [{ id: 'r18', name: 'AI Developer', description: '', capacity: 1, filledCount: 0 }, { id: 'r19', name: 'Frontend', description: '', capacity: 1, filledCount: 0 }], milestones: [{ id: 'm1', title: 'Data Collection', status: 'pending' }, { id: 'm2', title: 'Model Training', status: 'pending' }, { id: 'm3', title: 'UI Integration', status: 'pending' }], teams: [{ role: 'AI Developer', member: null }, { role: 'Frontend', member: null }], createdAt: new Date().toISOString(), clientId: 'u4' },
    { id: 'proj-9', title: 'Offers Module', description: 'Manage job offers in frontend.', category: 'Web', status: 'COMPLETED', requiredSkills: ['React', 'Node.js'], budget: 4000, owner: 'Baalvion Labs', currency: 'USD', startDate: '2026-03-22', endDate: '2026-04-07', maxTeamSize: 2, roles: [{ id: 'r20', name: 'Frontend', description: '', capacity: 1, filledCount: 0 }, { id: 'r21', name: 'Backend', description: '', capacity: 1, filledCount: 0 }], milestones: [{ id: 'm1', title: 'Design Offer UI', status: 'pending' }, { id: 'm2', title: 'Mock API', status: 'pending' }, { id: 'm3', title: 'Test Workflow', status: 'pending' }], teams: [{ role: 'Frontend', member: null }, { role: 'Backend', member: null }], createdAt: new Date().toISOString(), clientId: 'u4' },
    { id: 'proj-10', title: 'Project Milestones Tracker', description: 'Track project milestones and team roles.', category: 'Web', status: 'OPEN', requiredSkills: ['React', 'Tailwind', 'Node.js'], budget: 9000, owner: 'Baalvion Labs', currency: 'USD', startDate: '2026-03-25', endDate: '2026-04-10', maxTeamSize: 3, roles: [{ id: 'r22', name: 'Frontend', description: '', capacity: 1, filledCount: 0 }, { id: 'r23', name: 'Backend', description: '', capacity: 1, filledCount: 0 }, { id: 'r24', name: 'Designer', description: '', capacity: 1, filledCount: 0 }], milestones: [{ id: 'm1', title: 'Setup Milestone UI', status: 'pending' }, { id: 'm2', title: 'Connect Mock Teams', status: 'pending' }, { id: 'm3', title: 'Finalize Tracker', status: 'pending' }], teams: [{ role: 'Frontend', member: null }, { role: 'Backend', member: null }, { role: 'Designer', member: null }], createdAt: new Date().toISOString(), clientId: 'u4' }
];


// --- INVITATIONS ---
export let mockInvitations: Invitation[] = [
    {
        id: 'inv1',
        projectId: 'proj-2',
        teamId: 't2',
        fromUserId: 'u2',
        toUserId: 'u1', // Alice Johnson (default user)
        roleId: 'r3',
        status: 'Pending',
        createdAt: new Date().toISOString()
    }
];

// --- TEAMS ---
export let mockTeams: Team[] = [
    { id: 't1', projectId: 'proj-1', name: 'AI Pioneers', description: 'Team for AI Research Assistant project.', leaderId: 'u2', members: [{ userId: 'u2', roleId: 'r1', joinedAt: new Date().toISOString() }], invitations: mockInvitations.filter(i => i.teamId === 't1'), status: 'Active', createdAt: new Date().toISOString() },
    { id: 't2', projectId: 'proj-2', name: 'UI Avengers', description: 'Team for Frontend project.', leaderId: 'u1', members: [{ userId: 'u1', roleId: 'r4', joinedAt: new Date().toISOString() }], invitations: [], status: 'Draft', createdAt: new Date().toISOString() }
];


// --- APPLICATIONS ---
export let mockApplications: ProjectApplication[] = [
    { id: 'a1', projectId: 'proj-1', contractorId: 'u3', roleId: 'r2', proposalText: "I'm a data scientist with Python experience.", status: 'Pending', createdAt: new Date().toISOString() },
];


// --- MILESTONES ---
export let mockMilestones: Milestone[] = [
    { id: 'm1', projectId: 'proj-2', title: 'Setup Project Boilerplate', description: 'Initialize project with Next.js, TypeScript, and Tailwind.', amount: 500, status: 'APPROVED', dueDate: new Date().toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'm2', projectId: 'proj-2', title: 'Implement Design System', description: 'Create core UI components and style tokens.', amount: 1500, status: 'SUBMITTED', submissionUrl: 'http://github.com/pull/1', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), dueDate: new Date().toISOString() },
    { id: 'm3', projectId: 'proj-2', title: 'Build Authentication Flow', description: 'Implement login and registration pages.', amount: 1000, status: 'ACTIVE', dueDate: new Date().toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

// --- REVIEWS ---
export let mockReviews: ProjectReview[] = [];
