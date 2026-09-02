
// import { teamMembers } from '@/mocks/team.mock';
// import { TeamMember } from '@/mocks/team.mock';

// const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// export const teamMockService = {
//   async getTeamMembers(): Promise<TeamMember[]> {
//     await delay(300);
//     return [...teamMembers].sort((a, b) => a.name.localeCompare(b.name));
//   },

//   async getTeamMemberById(id: string): Promise<TeamMember | undefined> {
//     await delay(50);
//     return teamMembers.find(m => m.id === id);
//   },

//   async createTeamMember(data: Omit<TeamMember, 'id'>): Promise<TeamMember> {
//     await delay(500);
//     const newMember: TeamMember = {
//       ...data,
//       id: `team-member-${Date.now()}`
//     };
//     teamMembers.push(newMember);
//     return newMember;
//   },

//   async updateTeamMember(id: string, data: Partial<TeamMember>): Promise<TeamMember> {
//     await delay(500);
//     let member = teamMembers.find(m => m.id === id);
//     if (!member) {
//         throw new Error("Team member not found");
//     }
//     member = Object.assign(member, data);
//     return member;
//   },

//   async deleteTeamMember(id: string): Promise<{ success: boolean }> {
//     await delay(500);
//     const index = teamMembers.findIndex(m => m.id === id);
//     if (index > -1) {
//         teamMembers.splice(index, 1);
//         return { success: true };
//     }
//     return { success: false };
//   }
// }
