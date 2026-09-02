import { adapter } from './adapter';
import { TeamMember, teamMembers } from '@/lib/team.data';
import { leadershipTeam, globalLeaders } from '@/lib/data';

// Convert data.ts format to TeamMember format
const convertToTeamMember = (member: any, category: string): TeamMember => {
  return {
    id: member.name.toLowerCase().replace(/\s+/g, '-'),
    name: member.name,
    role: member.title,
    tagline: member.position || category,
    bio: member.bio,
    expertise: [],
    socials: {
      linkedin: '',
    },
    image: member.imageId || '',
    imageHint: 'person portrait',
  };
};

// Combine all team data
const getAllTeamMembers = (): TeamMember[] => {
  const leadership = leadershipTeam.map((member) =>
    convertToTeamMember(member, 'Leadership Team'),
  );
  const global = globalLeaders.map((member) =>
    convertToTeamMember(member, 'Global Leaders'),
  );
 

  return [...teamMembers, ...leadership, ...global];
};

export const teamService = {
  getTeamMembers: (): Promise<TeamMember[]> => {
    return Promise.resolve(getAllTeamMembers());
  },
  getTeamMemberById: (id: string): Promise<TeamMember | undefined> => {
    const allMembers = getAllTeamMembers();
    return Promise.resolve(allMembers.find((member) => member.id === id));
  },
  createTeamMember: (data: Omit<TeamMember, 'id'>): Promise<TeamMember> => {
    const newMember: TeamMember = {
      ...data,
      id: data.name.toLowerCase().replace(/\s+/g, '-'),
    };
    teamMembers.push(newMember);
    return Promise.resolve(newMember);
  },
  updateTeamMember: (
    id: string,
    data: Partial<TeamMember>,
  ): Promise<TeamMember> => {
    const index = teamMembers.findIndex((member) => member.id === id);
    if (index !== -1) {
      teamMembers[index] = { ...teamMembers[index], ...data };
      return Promise.resolve(teamMembers[index]);
    }
    throw new Error('Team member not found');
  },
  deleteTeamMember: (id: string): Promise<void> => {
    const index = teamMembers.findIndex((member) => member.id === id);
    if (index !== -1) {
      teamMembers.splice(index, 1);
      return Promise.resolve();
    }
    throw new Error('Team member not found');
  },
};
