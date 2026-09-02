import { ParsedResumeData } from '@/types';
import { extractEducation } from './educationExtractor';
import { extractExperience } from './experienceCalculator';
import { extractLinks } from './linkExtractor';
import { extractSkills } from './skillExtractor';

function extractNameAndEmail(text: string): {
  name: string;
  email: string;
  phone: string;
} {
  // Simple regex for email and assumes the first line is the name.
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const phoneRegex = /(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/;

  const emailMatch = text.match(emailRegex);
  const email = emailMatch ? emailMatch[0] : '';

  const phoneMatch = text.match(phoneRegex);
  const phone = phoneMatch ? phoneMatch[0] : '';

  const name = text.split('\n')[0].trim();

  return { name, email, phone };
}

export function parseResumeText(
  rawText: string,
): ParsedResumeData | { error: string } {
  if (!rawText || rawText.length < 50) {
    return { error: 'Resume text is too short to parse.' };
  }

  try {
    const { name, email, phone } = extractNameAndEmail(rawText);
    const links = extractLinks(rawText);
    const skills = extractSkills(rawText);
    const education = extractEducation(rawText);
    const experience = extractExperience(rawText);

    // Confidence Score Calculation
    let confidenceScore = 100;
    if (!email) confidenceScore -= 20;
    if (skills.skills.length === 0 && skills.technologies.length === 0)
      confidenceScore -= 25;
    if (experience.workExperience.length === 0) confidenceScore -= 25;
    if (education.length === 0) confidenceScore -= 10;
    confidenceScore = Math.max(0, confidenceScore);

    const parsedData: ParsedResumeData = {
      extractedName: name,
      extractedEmail: email,
      phone,
      ...links,
      skills: skills.skills,
      technologies: skills.technologies,
      education,
      workExperience: experience.workExperience,
      totalExperienceMonths: experience.totalExperienceMonths,
      certifications: [], // Mocked for now
      confidenceScore,
    };

    return parsedData;
  } catch (e) {
    return { error: 'An unexpected error occurred during parsing.' };
  }
}
