export type PayFrequency = 'annual' | 'monthly';

export interface Compensation {
  currency: string; // e.g., 'USD', 'INR'
  minSalary?: number;
  maxSalary?: number;
  payFrequency: PayFrequency;
  bonusEligible: boolean;
  equityAvailable: boolean;
  benefitsSummary?: string;
  salaryVisible: boolean;
}
