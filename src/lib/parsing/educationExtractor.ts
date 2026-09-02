import { ParsedEducation } from '@/types';

const DEGREE_PATTERNS = [
  'B.Tech',
  'B.S.',
  'BSc',
  "Bachelor's",
  'Bachelor',
  'M.Tech',
  'M.S.',
  'MSc',
  "Master's",
  'Master',
  'MBA',
  'PhD',
  'Doctorate',
];

export function extractEducation(text: string): ParsedEducation[] {
  const education: ParsedEducation[] = [];
  const lines = text.split('\n');

  // This is a very simple mock parser. A real one would be much more complex.
  lines.forEach((line) => {
    for (const degree of DEGREE_PATTERNS) {
      const regex = new RegExp(`\\b${degree}\\b`, 'i');
      if (line.match(regex)) {
        const yearMatch = line.match(/\b(20\d{2})\b/);

        // Avoid re-adding if already processed a similar line
        if (education.some((e) => e.institution.includes(line.trim())))
          continue;

        education.push({
          degree: degree,
          institution: line
            .replace(degree, '')
            .replace(yearMatch ? yearMatch[0] : '', '')
            .trim()
            .replace(/,$/, '')
            .trim(),
          year: yearMatch ? yearMatch[0] : 'N/A',
        });
        // Once a degree is found in a line, we assume the line is processed.
        return;
      }
    }
  });

  return education;
}
