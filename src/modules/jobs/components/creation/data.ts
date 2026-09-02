import { Job } from "@/lib/talent-acquisition";
import { JobCreationData } from "./schema";

export const mockDepartments = [
    { value: 'dept_eng_it', label: 'Engineering / IT / Software' },
    { value: 'dept_sales', label: 'Sales & Marketing' },
    { value: 'dept_hr', label: 'HR & Talent Acquisition' },
    { value: 'dept_finance', label: 'Finance / Accounting' },
];

export const mockHiringManagers = [
    { value: 'user-1', label: 'Alice Johnson' },
    { value: 'user-2', label: 'Bob Williams' },
];

export const mockApprovalRoles = [
    { value: 'ADMIN', label: 'Admin' },
    { value: 'COMPLIANCE_OFFICER', label: 'Compliance Officer' },
    { value: 'COUNTRY_HR', label: 'Country HR' },
];

export const mockSkillOptions = [
  { id: "react", name: "React" },
  { id: "typescript", name: "TypeScript" },
  { id: "go", name: "Go (Golang)" },
  { id: "python", name: "Python" },
  { id: "aws", name: "AWS" },
  { id: "k8s", name: "Kubernetes" },
  { id: "sql", name: "SQL" },
  { id: "product-management", name: "Product Management" },
];


export const getInitialValues = (existingJob?: Job | null): JobCreationData => {
    if (existingJob) {
        // This is where you would map the API `Job` object back to the form's data structure.
        // This is a simplified version.
        return {
            basicInfo: {
                title: existingJob.title,
                internalCode: existingJob.requisitionCode,
                departmentId: existingJob.departmentId,
                employmentType: existingJob.employmentType,
                workforceType: existingJob.workforceType,
                countryId: existingJob.countryId,
                city: existingJob.city,
                slug: 'existing-slug', // Should be from job
                summary: existingJob.description.substring(0, 200),
            },
            roleDetails: {
                description: existingJob.description,
                responsibilities: existingJob.responsibilities.map(value => ({ value })),
                requiredQualifications: existingJob.qualifications.map(value => ({ value })),
                preferredQualifications: [],
                experienceBand: existingJob.experienceBand,
                education: 'Bachelors',
            },
            skills: {
                required: [],
                preferred: [],
            },
            compensation: {
                currency: existingJob.currency || 'USD',
                minSalary: 100000,
                maxSalary: 120000,
                frequency: 'Annual',
                bonus: '10%',
                equity: existingJob.equityEligible,
                visibility: 'Public',
            },
            compliance: {
                workAuth: existingJob.visaSponsorship,
                visaSponsorship: existingJob.visaSponsorship,
                gdprConsent: false,
                relocation: existingJob.relocationSupport,
            },
            workflow: {
                status: existingJob.status,
                isFeatured: false,
                isInternalOnly: existingJob.visibility === 'internal',
                allowExternal: existingJob.visibility === 'public',
                priority: 'Medium',
                approvalChain: [],
            }
        };
    }
    
    // Default values for a new job
    return {
        basicInfo: {
            title: "",
            internalCode: "",
            departmentId: "",
            employmentType: "Full-time",
            workforceType: "Hybrid",
            countryId: "country_in",
            city: "",
            slug: "",
            summary: "",
        },
        roleDetails: {
            description: "",
            responsibilities: [{ value: "" }],
            requiredQualifications: [{ value: "" }],
            preferredQualifications: [],
            experienceBand: "Mid",
            education: "",
        },
        skills: {
            required: [],
            preferred: [],
        },
        compensation: {
            currency: 'USD',
            frequency: 'Annual',
            equity: false,
            visibility: 'Public',
        },
        compliance: {
            workAuth: true,
            visaSponsorship: false,
            gdprConsent: false,
            relocation: false,
        },
        workflow: {
            status: "draft",
            isFeatured: false,
            isInternalOnly: false,
            allowExternal: true,
            priority: 'Medium',
            approvalChain: [],
        },
    };
};
