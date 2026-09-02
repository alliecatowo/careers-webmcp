import { ParsedWorkExperience } from '@/types';

const MONTHS: { [key: string]: number } = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  oct: 9,
  nov: 10,
  dec: 11,
};

function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  if (dateStr.toLowerCase().trim() === 'present') {
    return new Date();
  }
  const parts = dateStr
    .trim()
    .toLowerCase()
    .split(/[\s,]+/);
  const monthStr = parts[0];
  const yearStr = parts[1];

  if (!monthStr || !yearStr) return null;

  const month = MONTHS[monthStr.substring(0, 3)];
  const year = parseInt(yearStr, 10);

  if (month !== undefined && !isNaN(year)) {
    // Return the first day of the month for calculation purposes
    return new Date(year, month, 1);
  }
  return null;
}

export function extractExperience(text: string): {
  workExperience: ParsedWorkExperience[];
  totalExperienceMonths: number;
} {
  const workExperience: ParsedWorkExperience[] = [];
  let totalExperienceMonths = 0;

  // Regex for "Role at Company" and a date range like "(Month YYYY – Month YYYY)" on the next line
  const expRegex =
    /^(.*) at (.*)[\r\n]+\s*\(?([a-zA-Z]+\s\d{4})\s*–\s*([a-zA-Z]+\s\d{4}|Present)\)?/gm;
  let match;

  while ((match = expRegex.exec(text)) !== null) {
    const role = match[1].trim();
    const company = match[2].trim();
    const startDateStr = match[3].trim();
    const endDateStr = match[4].trim();

    const startDate = parseDate(startDateStr);
    const endDate = parseDate(endDateStr);

    let durationMonths = 0;
    if (startDate && endDate) {
      const yearDiff = endDate.getFullYear() - startDate.getFullYear();
      const monthDiff = endDate.getMonth() - startDate.getMonth();
      durationMonths = yearDiff * 12 + monthDiff + 1; // Add 1 for inclusive month count
      totalExperienceMonths += durationMonths;
    }

    workExperience.push({
      role,
      company,
      startDate: startDateStr,
      endDate: endDateStr,
      durationMonths,
    });
  }

  return { workExperience, totalExperienceMonths };
}
