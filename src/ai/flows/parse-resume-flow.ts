'use server';
/**
 * @fileOverview A Genkit flow for parsing resume text and extracting key information into a structured format.
 *
 * - parseResume - A function that handles the resume parsing process.
 * - ParseResumeInput - The input type for the parseResume function.
 * - ParseResumeOutput - The return type for the parseResume function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ParseResumeInputSchema = z.object({
  resumeText: z.string().describe('The full text content of the resume to be parsed.'),
});
export type ParseResumeInput = z.infer<typeof ParseResumeInputSchema>;

const ParseResumeOutputSchema = z.object({
  personalInfo: z.object({
    name: z.string().optional().describe('The full name of the candidate.'),
    email: z.string().email().optional().describe('The email address of the candidate.'),
    phone: z.string().optional().describe('The phone number of the candidate.'),
    linkedinUrl: z.string().url().optional().describe('LinkedIn profile URL.'),
    portfolioUrl: z.string().url().optional().describe('Personal portfolio or website URL.'),
    location: z.string().optional().describe('Candidate\'s current location (e.g., City, State, Country).'),
  }).optional().describe('Contact and personal details extracted from the resume.'),
  summary: z.string().optional().describe('A brief professional summary or objective statement from the resume.'),
  workExperience: z.array(
    z.object({
      title: z.string().describe('Job title.'),
      company: z.string().describe('Company name.'),
      location: z.string().optional().describe('Location of the job (e.g., City, State, Country).'),
      startDate: z.string().describe('Start date of the employment (e.g., "Month Year" or "Year").'),
      endDate: z.string().optional().describe('End date of the employment (e.g., "Month Year" or "Year"), or "Present" if currently employed.'),
      description: z.string().optional().describe('Key responsibilities and achievements in this role, summarized concisely.'),
    })
  ).optional().describe('A list of work experiences.'),
  education: z.array(
    z.object({
      degree: z.string().describe('Degree obtained (e.g., "B.S.", "Master of Science", "Ph.D.").'),
      major: z.string().optional().describe('Major or field of study.'),
      institution: z.string().describe('Name of the educational institution.'),
      location: z.string().optional().describe('Location of the institution (e.g., City, State, Country).'),
      graduationDate: z.string().optional().describe('Graduation date (e.g., "Month Year" or "Year").'),
    })
  ).optional().describe('A list of educational backgrounds.'),
  skills: z.array(z.string()).optional().describe('A list of key skills, categorized if possible (e.g., "Programming Languages", "Tools", "Soft Skills").'),
}).describe('Structured information extracted from a resume.');
export type ParseResumeOutput = z.infer<typeof ParseResumeOutputSchema>;

export async function parseResume(input: ParseResumeInput): Promise<ParseResumeOutput> {
  return parseResumeFlow(input);
}

const parseResumePrompt = ai.definePrompt({
  name: 'parseResumePrompt',
  input: { schema: ParseResumeInputSchema },
  output: { schema: ParseResumeOutputSchema },
  prompt: `You are an expert resume parser assistant. Your task is to carefully extract all key information from the provided resume text and structure it into a JSON object according to the specified output schema. If a piece of information is not found, you should omit that field from the output or use an empty array for lists, as per the schema's optionality.

Specifically, extract:
- Personal information: Name, email, phone number, LinkedIn profile URL, personal portfolio/website URL, and current location.
- A brief professional summary or objective statement.
- Work experience: For each role, include the job title, company name, job location, start date, end date (use "Present" if currently employed), and a concise description of responsibilities and achievements.
- Education: For each entry, include the degree obtained, major or field of study, name of the educational institution, institution location, and graduation date.
- Skills: A comprehensive list of all relevant technical and soft skills.

Ensure all dates are parsed consistently (e.g., "Month Year", "YYYY"). Do not hallucinate information; only extract what is explicitly present in the resume.

Resume Text:
---
{{{resumeText}}}
---`,
});

const parseResumeFlow = ai.defineFlow(
  {
    name: 'parseResumeFlow',
    inputSchema: ParseResumeInputSchema,
    outputSchema: ParseResumeOutputSchema,
  },
  async (input) => {
    const { output } = await parseResumePrompt(input);
    if (!output) {
      throw new Error('Failed to parse resume: No output generated.');
    }
    return output;
  }
);
