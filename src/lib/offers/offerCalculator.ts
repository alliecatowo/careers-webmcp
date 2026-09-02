
'use server';

type CompensationPackage = {
  baseSalary: number;
  bonus: number;
  equity: number;
  benefits: number;
};

/**
 * Calculates the total local compensation from its components.
 * @param {CompensationPackage} components - The compensation components.
 * @returns An object containing the total local compensation.
 */
export function calculateTotalCompensation(components: CompensationPackage): { totalLocal: number } {
  const totalLocal = (components.baseSalary || 0) + (components.bonus || 0) + (components.equity || 0) + (components.benefits || 0);
  return { totalLocal };
}
