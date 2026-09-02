export type MockRole = {
    value: string;
    label: string;
    country: string;
};

export const mockRoles: MockRole[] = [
    { value: 'swe_intern', label: 'Software Engineering Intern', country: 'IN' },
    { value: 'pm_intern', label: 'Product Management Intern', country: 'IN' },
    { value: 'data_intern', label: 'Data Science Intern', country: 'IN' },
    { value: 'sde_1_us', label: 'Software Development Engineer I', country: 'US' },
    { value: 'marketing_us', label: 'Product Marketing Manager', country: 'US' },
    { value: 'backend_pl', label: 'Backend Engineer (Go)', country: 'PL' },
    { value: 'devops_pl', label: 'DevOps Engineer', country: 'PL' },
    { value: 'csm_gb', label: 'Customer Success Manager', country: 'GB' },
];

export function getRolesByCountry(countrySlug: string): MockRole[] {
    const countryMap: Record<string, string> = {
        "india": "IN",
        "united-states": "US",
        "poland": "PL",
        "united-kingdom": "GB"
    };
    const isoCode = countryMap[countrySlug];
    if (!isoCode) return [];
    return mockRoles.filter(role => role.country === isoCode);
}
