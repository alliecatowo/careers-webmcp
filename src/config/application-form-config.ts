
import { Country } from '@/lib/talent-acquisition';
import { MultiPhaseApplicationData } from '@/types/application.types';

export type FieldType = 'text' | 'email' | 'tel' | 'url' | 'select' | 'textarea' | 'checkbox' | 'file' | 'multi-select' | 'checkbox-group' | 'slider';

export interface FormFieldConfig {
  name: keyof MultiPhaseApplicationData;
  label: string;
  type: FieldType;
  placeholder?: string;
  description?: string;
  options?: { value: string; label: string }[];
  displayRule?: (country: Country) => boolean;
  otherFieldName?: keyof MultiPhaseApplicationData; // For "Other" text input in checkbox groups
}

export interface FormPhase {
  title: string;
  fields: FormFieldConfig[];
}

const frontendTechOptions = ["React", "Angular", "Vue", "Svelte", "HTML", "CSS", "JavaScript", "TypeScript", "Next.js", "Redux", "TailwindCSS", "Bootstrap", "Material-UI"].map(t => ({ value: t, label: t }));
const backendTechOptions = ["Node.js", "Express.js", "Python", "Django", "Flask", "Java", "Spring", "C#", ".NET", "PHP", "Laravel", "Go", "Ruby on Rails", "SQL", "MySQL", "PostgreSQL", "MongoDB", "Redis"].map(t => ({ value: t, label: t }));
const devopsTechOptions = ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "CI/CD", "Terraform", "Jenkins"].map(t => ({ value: t, label: t }));

export const formConfig: { phases: FormPhase[] } = {
  phases: [
    {
      title: "Basic Information",
      fields: [
        { name: "fullName", label: "Full Name", type: "text", placeholder: "Jane Doe" },
        { name: "email", label: "Email Address", type: "email", placeholder: "jane.doe@example.com" },
        { name: "phone", label: "Phone Number", type: "tel", placeholder: "+1 (555) 123-4567" },
        { name: "preferredWorkModel", label: "Preferred Work Model", type: "select", placeholder: "Select your preference", options: [{value: "onsite", label: "On-site"}, {value: "hybrid", label: "Hybrid"}, {value: "remote", label: "Remote"}] },
        { name: "internshipDuration", label: "Internship Duration / Availability", type: "text", placeholder: "e.g., 6 months, starting June 2024" },
        { name: "linkedinUrl", label: "LinkedIn Profile", type: "url", placeholder: "https://linkedin.com/in/..." },
        { name: "portfolioUrl", label: "Portfolio / GitHub URL", type: "url", placeholder: "https://github.com/..." },
        { name: "resume", label: "Upload Resume/CV", type: "file", description: "PDF, DOC, DOCX only. Max 5MB." },
        { name: "coverLetter", label: "Cover Letter", type: "textarea", placeholder: "Briefly tell us why you're a great fit for this role." },
        { name: "sourceOfDiscovery", label: "How did you hear about us?", type: "text", placeholder: "e.g., LinkedIn, university job fair, etc." },
        { name: "consentGiven", label: "Data Privacy Consent", type: "checkbox", description: "I agree to the terms of the Baalvion Privacy Policy and consent to my data being processed for recruitment purposes." },
      ],
    },
    {
      title: "Skills & Projects",
      fields: [
        { name: "primaryExpertise", label: "Primary Expertise", type: "select", options: [{value: "frontend", label: "Front-End Developer"}, {value: "backend", label: "Back-End Developer"}, {value: "fullstack", label: "Full-Stack Developer"}] },
        { name: "frontendTechnologies", label: "Front-End Technologies", type: "checkbox-group", options: frontendTechOptions, otherFieldName: "frontendTechnologiesOther" },
        { name: "frontendExpertise", label: "Front-End Expertise (%)", type: "slider", placeholder: "Your estimated proficiency" },
        { name: "backendTechnologies", label: "Back-End Technologies", type: "checkbox-group", options: backendTechOptions, otherFieldName: "backendTechnologiesOther" },
        { name: "backendExpertise", label: "Back-End Expertise (%)", type: "slider", placeholder: "Your estimated proficiency" },
        { name: "devopsTechnologies", label: "Cloud / DevOps (Optional)", type: "checkbox-group", options: devopsTechOptions, otherFieldName: "devopsTechnologiesOther" },
        { name: "devopsExpertise", label: "Cloud / DevOps Expertise (%)", type: "slider", placeholder: "Your estimated proficiency" },
        { name: "projects", label: "Projects / Achievements", type: "textarea", placeholder: "Describe 1-2 significant projects you've worked on." },
        { name: "technicalChallengeLink", label: "Technical Challenge Submission Link (Optional)", type: "url", placeholder: "Link to your submission (e.g., Replit, CodeSandbox)" },
        { name: "certifications", label: "Upload Certifications (Optional)", type: "file" },
        { name: "declaration", label: "Declaration", type: "checkbox", description: "I declare that all the information provided in this application is accurate to the best of my knowledge." },
      ],
    },
    {
      title: "Verification",
      fields: [
        { name: "nationalId", label: "Aadhar Number", type: "text", placeholder: "Enter your 12-digit Aadhar number", displayRule: (country) => country.isoCode === 'IN' },
        { name: "nationalId", label: "Social Security Number (SSN)", type: "text", placeholder: "Enter your SSN", displayRule: (country) => country.isoCode === 'US' },
        { name: "nationalId", label: "National Insurance Number", type: "text", placeholder: "Enter your NI Number", displayRule: (country) => country.isoCode === 'GB' },
        { name: "nationalId", label: "Social Insurance Number (SIN)", type: "text", placeholder: "Enter your SIN", displayRule: (country) => country.isoCode === 'CA' },
        { name: "nationalId", label: "PESEL Number", type: "text", placeholder: "Enter your PESEL", displayRule: (country) => country.isoCode === 'PL' },
        { name: "taxId", label: "PAN Card Number", type: "text", placeholder: "Enter your PAN", displayRule: (country) => country.isoCode === 'IN' },
        { name: "taxId", label: "Tax File Number (TFN)", type: "text", placeholder: "Enter your TFN", displayRule: (country) => country.isoCode === 'AU' },
        { name: "experienceCertificate", label: "Upload Experience Certificate (Optional)", type: "file" },
        { name: "lastJobCertificate", label: "Upload Last Job Certificate (Optional)", type: "file" },
        { name: "recommendationLetters", label: "Upload Recommendation Letters (Optional)", type: "file" },
        { name: "photoId", label: "Upload Passport / Photo ID", type: "file", description: "Required for verification." },
        { name: "selfDeclaration", label: "Self-Declaration", type: "checkbox", description: "I hereby declare that all documents submitted are true copies of the originals." },
      ],
    },
  ],
};
