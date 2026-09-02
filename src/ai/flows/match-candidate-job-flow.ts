'use server';
/**
 * @fileOverview A Genkit flow for matching a candidate's resume against a job description.
 *
 * - matchCandidateJob - A function that handles the job matching process.
 * - MatchCandidateJobInput - The input type for the matchCandidateJob function.
 * - MatchCandidateJobOutput - The return type for the matchCandidateJob function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema
const MatchCandidateJobInputSchema = z.object({
  candidateResumeText: z.string().describe('The full text content of the candidate\'s parsed resume.'),
  jobDescriptionText: z.string().describe('The full text content of the job description.'),
});
export type MatchCandidateJobInput = z.infer<typeof MatchCandidateJobInputSchema>;

// Output Schema
const MatchCandidateJobOutputSchema = z.object({
  matchPercentage: z.number().min(0).max(100).describe('A numerical score between 0 and 100 representing how well the candidate\'s resume matches the job description.'),
  explanation: z.string().describe('A detailed explanation of the match, highlighting key strengths, weaknesses, and specific areas of alignment or mismatch between the resume and the job description.'),
});
export type MatchCandidateJobOutput = z.infer<typeof MatchCandidateJobOutputSchema>;

// Prompt Definition
const matchCandidateJobPrompt = ai.definePrompt({
  name: 'matchCandidateJobPrompt',
  input: {schema: MatchCandidateJobInputSchema},
  output: {schema: MatchCandidateJobOutputSchema},
  prompt: `You are an expert recruiter and a highly skilled AI assistant specializing in job matching.\nYour task is to compare a candidate\'s resume against a given job description and provide a relevance score (match percentage) and a concise explanation.\n\nAnalyze the candidate\'s skills, experience, and qualifications as presented in their resume, and compare them against the requirements, responsibilities, and desired qualifications in the job description.\n\nProvide a matchPercentage (0-100) indicating how well the candidate\'s resume aligns with the job description.\nAlso, provide an explanation that justifies the matchPercentage. The explanation should point out specific strengths and weaknesses, mentioning skills or experiences that are particularly relevant or missing.\n\n---\nJob Description:\n{{{jobDescriptionText}}}\n\n---\nCandidate\'s Resume:\n{{{candidateResumeText}}}\n\n---\nBased on the above, calculate the match percentage and provide an explanation.`,
});

// Flow Definition
const matchCandidateJobFlow = ai.defineFlow(
  {
    name: 'matchCandidateJobFlow',
    inputSchema: MatchCandidateJobInputSchema,
    outputSchema: MatchCandidateJobOutputSchema,
  },
  async (input) => {
    const {output} = await matchCandidateJobPrompt(input);
    if (!output) {
      throw new Error('Failed to get output from prompt.');
    }
    return output;
  }
);

// Wrapper function
export async function matchCandidateJob(input: MatchCandidateJobInput): Promise<MatchCandidateJobOutput> {
  return matchCandidateJobFlow(input);
}
