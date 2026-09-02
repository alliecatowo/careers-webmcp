'use server';
/**
 * @fileOverview A Genkit flow for generating a concise, AI-powered summary of a candidate's key qualifications and relevant experience from their parsed resume.
 *
 * - generateCandidateSummary - A function that handles the candidate summary generation process.
 * - GenerateCandidateSummaryInput - The input type for the generateCandidateSummary function.
 * - GenerateCandidateSummaryOutput - The return type for the generateCandidateSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCandidateSummaryInputSchema = z.object({
  resumeText: z
    .string()
    .describe("The full text content of the candidate's parsed resume."),
});
export type GenerateCandidateSummaryInput = z.infer<
  typeof GenerateCandidateSummaryInputSchema
>;

const GenerateCandidateSummaryOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      "A concise, AI-powered summary of the candidate's key qualifications and relevant experience."
    ),
});
export type GenerateCandidateSummaryOutput = z.infer<
  typeof GenerateCandidateSummaryOutputSchema
>;

export async function generateCandidateSummary(
  input: GenerateCandidateSummaryInput
): Promise<GenerateCandidateSummaryOutput> {
  return generateCandidateSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCandidateSummaryPrompt',
  input: {schema: GenerateCandidateSummaryInputSchema},
  output: {schema: GenerateCandidateSummaryOutputSchema},
  prompt: `You are an expert recruiter. Your task is to generate a concise, AI-powered summary of a candidate's key qualifications and relevant experience based on the provided resume text. The summary should highlight the most important skills, experiences, and achievements relevant to a typical job role.

Resume Text:
{{{resumeText}}}`,
});

const generateCandidateSummaryFlow = ai.defineFlow(
  {
    name: 'generateCandidateSummaryFlow',
    inputSchema: GenerateCandidateSummaryInputSchema,
    outputSchema: GenerateCandidateSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
