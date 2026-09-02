
import { User } from "@/types";

export const mockUsers: User[] = [
    { 
        id: 'user-recruiter', 
        name: 'Beth Harmon', 
        email: 'beth@acme.inc', 
        role: 'RECRUITER',
        avatarUrl: 'https://i.pravatar.cc/150?u=beth'
    },
    { 
        id: 'user-admin', 
        name: 'John Admin', 
        email: 'admin@acme.inc', 
        role: 'SUPER_ADMIN',
        avatarUrl: 'https://i.pravatar.cc/150?u=admin'
    },
    { 
        id: 'user-candidate', 
        name: 'Elena Rodriguez', 
        email: 'elena.rodriguez@example.com', 
        role: 'CANDIDATE',
        avatarUrl: 'https://i.pravatar.cc/150?u=elena'
    },
     { 
        id: 'user-interviewer-1', 
        name: 'Tim Cook', 
        email: 'tim@apple.com', 
        role: 'RECRUITER',
        avatarUrl: 'https://i.pravatar.cc/150?u=tim'
    },
    { 
        id: 'user-interviewer-2', 
        name: 'Elon Musk', 
        email: 'elon@tesla.com', 
        role: 'RECRUITER',
        avatarUrl: 'https://i.pravatar.cc/150?u=elon'
    },
    { 
        id: 'user-finance', 
        name: 'John Finance', 
        email: 'finance@acme.inc', 
        role: 'RECRUITER', // In RBAC this would be 'FINANCE'
        avatarUrl: 'https://i.pravatar.cc/150?u=finance'
    },
];
