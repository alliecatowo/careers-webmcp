import { PlaceHolderImages } from '@/lib/placeholder-images';

export interface TeamMember {
  name: string;
  title: string;
  bio: string;
  imageId: string;
  position?: string;
}

// export let teamMembers: TeamMember[] = [
//   {
//     id: 'arjun-verma',
//     name: 'Arjun Verma',
//     role: 'Founder & Chief Architect',
//     tagline: 'Building the rails for global talent.',
//     bio: 'Arjun is the visionary behind Baalvion, driven by the belief that talent is borderless. With a background in distributed systems and fintech, he is architecting the intelligent infrastructure to power the future of work.',
//     expertise: [
//       'System Architecture',
//       'Go (Golang)',
//       'Fintech',
//       'Product Strategy',
//     ],
//     socials: {
//       linkedin: 'https://linkedin.com/in/arjunverma',
//       portfolio: 'https://github.com/arjunverma',
//     },
//     image:
//       PlaceHolderImages.find((i) => i.id === 'team-member-1')?.imageUrl || '',
//     imageHint: 'male portrait',
//   },
//   {
//     id: 'priya-sharma',
//     name: 'Priya Sharma',
//     role: 'Head of Product',
//     tagline: 'Crafting experiences that empower.',
//     bio: 'Priya leads the product team with a relentless focus on the user. She translates complex hiring challenges into simple, elegant solutions, ensuring Baalvion is not just powerful, but intuitive.',
//     expertise: [
//       'Product Management',
//       'UX Strategy',
//       'SaaS',
//       'Agile Methodologies',
//     ],
//     socials: {
//       linkedin: 'https://linkedin.com/in/priyasharma',
//     },
//     image:
//       PlaceHolderImages.find((i) => i.id === 'team-member-2')?.imageUrl || '',
//     imageHint: 'female portrait',
//   },
//   {
//     id: 'david-chen',
//     name: 'David Chen',
//     role: 'Lead Platform Engineer',
//     tagline: 'Obsessed with scale and reliability.',
//     bio: 'David is responsible for the core infrastructure of Baalvion. He specializes in building fault-tolerant, scalable systems on the cloud, ensuring our platform is always on, no matter the demand.',
//     expertise: [
//       'DevOps',
//       'Kubernetes',
//       'AWS',
//       'Site Reliability Engineering (SRE)',
//     ],
//     socials: {
//       linkedin: 'https://linkedin.com/in/davidchen',
//       portfolio: 'https://github.com/davidchen',
//     },
//     image:
//       PlaceHolderImages.find((i) => i.id === 'team-member-3')?.imageUrl || '',
//     imageHint: 'person portrait',
//   },
//   {
//     id: 'emily-woods',
//     name: 'Emily Woods',
//     role: 'Lead Frontend Engineer',
//     tagline: 'Turning pixels into performance.',
//     bio: 'Emily leads the frontend team, where she combines her passion for design with deep technical expertise. She is dedicated to building a fast, accessible, and beautiful interface for all Baalvion users.',
//     expertise: [
//       'React',
//       'TypeScript',
//       'Performance Optimization',
//       'Accessibility (a11y)',
//     ],
//     socials: {
//       linkedin: 'https://linkedin.com/in/emilywoods',
//       portfolio: 'https://github.com/emilywoods',
//     },
//     image:
//       PlaceHolderImages.find((i) => i.id === 'team-member-4')?.imageUrl || '',
//     imageHint: 'person portrait',
//   },
//   {
//     id: 'samuel-jones',
//     name: 'Samuel Jones',
//     role: 'Head of AI & Data Science',
//     tagline: 'Finding signal in the noise.',
//     bio: "Samuel and his team are the brains behind Baalvion's intelligence layer. He develops the algorithms that parse resumes, score candidates, and mitigate bias, making hiring faster and fairer.",
//     expertise: [
//       'Machine Learning',
//       'Natural Language Processing (NLP)',
//       'Python',
//       'Data Ethics',
//     ],
//     socials: {
//       linkedin: 'https://linkedin.com/in/samueljones',
//     },
//     image:
//       PlaceHolderImages.find((i) => i.id === 'team-member-5')?.imageUrl || '',
//     imageHint: 'male portrait',
//   },
//   {
//     id: 'chloe-kim',
//     name: 'Chloe Kim',
//     role: 'Head of Design (UX/UI)',
//     tagline: 'Designing for clarity and trust.',
//     bio: 'Chloe believes that enterprise software should be a joy to use. She leads the design team in creating a user experience that is not only functional but also builds trust and confidence with every interaction.',
//     expertise: ['UX/UI Design', 'Figma', 'User Research', 'Design Systems'],
//     socials: {
//       linkedin: 'https://linkedin.com/in/chloekim',
//       portfolio: 'https://dribbble.com/chloekim',
//     },
//     image:
//       PlaceHolderImages.find((i) => i.id === 'team-member-6')?.imageUrl || '',
//     imageHint: 'female portrait',
//   },
//   {
//     id: 'omar-al-fayed',
//     name: 'Omar Al-Fayed',
//     role: 'Head of Global Compliance',
//     tagline: 'Navigating the complexities of global hiring.',
//     bio: 'With a background in international law and technology, Omar ensures that the Baalvion platform operates in full compliance with the labor and data privacy laws of every country we support.',
//     expertise: ['RegTech', 'GDPR', 'International Law', 'Risk Management'],
//     socials: {
//       linkedin: 'https://linkedin.com/in/omaralfayed',
//     },
//     image:
//       PlaceHolderImages.find((i) => i.id === 'team-member-7')?.imageUrl || '',
//     imageHint: 'person portrait',
//   },
//   {
//     id: 'kenji-tanaka',
//     name: 'Kenji Tanaka',
//     role: 'Principal Security Engineer',
//     tagline: 'Securing talent, everywhere.',
//     bio: "Kenji is our resident cybersecurity expert. He works tirelessly to protect our platform and our users' data, implementing enterprise-grade security measures at every layer of the stack.",
//     expertise: [
//       'Cybersecurity',
//       'Cloud Security',
//       'Penetration Testing',
//       'Zero Trust Architecture',
//     ],
//     socials: {
//       linkedin: 'https://linkedin.com/in/kenjitanaka',
//     },
//     image:
//       PlaceHolderImages.find((i) => i.id === 'team-member-8')?.imageUrl || '',
//     imageHint: 'person portrait',
//   },
// ];
