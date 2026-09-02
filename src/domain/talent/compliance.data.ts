
import { ComplianceProfile } from "@/lib/talent-acquisition";

export const complianceProfiles: ComplianceProfile[] = [
  {
    id: "compliance_in",
    countryId: "country_in",
    laborLawReference: "Shops and Establishment Act, IT Act 2000",
    dataProtectionRegime: "Digital Personal Data Protection Act, 2023",
    equalOpportunityStatement: "Baalvion is an equal opportunity employer. We celebrate diversity and are committed to creating an inclusive environment for all employees.",
    hiringDisclosureText: "All hiring and employment practices in India adhere to local and national labor laws and regulations."
  },
  {
    id: "compliance_us",
    countryId: "country_us",
    laborLawReference: "Fair Labor Standards Act (FLSA), Title VII of the Civil Rights Act of 1964",
    dataProtectionRegime: "CCPA/CPRA, and other state-specific laws",
    equalOpportunityStatement: "Baalvion is an equal opportunity employer and complies with all applicable federal, state, and local fair employment practices laws.",
    hiringDisclosureText: "We are committed to providing equal employment opportunities to all employees and applicants for employment."
  },
  {
    id: "compliance_uk",
    countryId: "country_gb",
    laborLawReference: "Equality Act 2010",
    dataProtectionRegime: "UK GDPR, Data Protection Act 2018",
    equalOpportunityStatement: "Baalvion is an equal opportunity employer. We value diversity and are committed to creating an inclusive environment for all employees.",
    hiringDisclosureText: "All hiring and employment practices in the UK adhere to local labour laws and regulations."
  },
  {
    id: "compliance_ca",
    countryId: "country_ca",
    laborLawReference: "Canada Labour Code and provincial employment standards",
    dataProtectionRegime: "PIPEDA",
    equalOpportunityStatement: "Baalvion is an equal opportunity employer and encourages applications from all qualified individuals.",
    hiringDisclosureText: "All hiring and employment practices in Canada adhere to federal and provincial labor laws."
  },
   {
    id: "compliance_eu",
    countryId: "country_pl",
    laborLawReference: "Polish Labour Code, EU Directives",
    dataProtectionRegime: "General Data Protection Regulation (GDPR)",
    equalOpportunityStatement: "Baalvion is an equal opportunity employer. All applicants will be considered for employment without attention to race, color, religion, sex, sexual orientation, gender identity, national origin, veteran or disability status.",
    hiringDisclosureText: "All hiring practices conform to EU and local regulations."
  },
   {
    id: "compliance_au",
    countryId: "country_au",
    laborLawReference: "Fair Work Act 2009",
    dataProtectionRegime: "Privacy Act 1988",
    equalOpportunityStatement: "Baalvion is an equal opportunity employer, and we encourage people from all backgrounds to apply.",
    hiringDisclosureText: "Hiring practices are in accordance with the Fair Work Act."
  },
  {
    id: "compliance_vn",
    countryId: "country_vn",
    laborLawReference: "Labour Code of Vietnam 2019",
    dataProtectionRegime: "Decree 13/2023/ND-CP on Personal Data Protection",
    equalOpportunityStatement: "Baalvion provides equal employment opportunities to all employees and applicants.",
    hiringDisclosureText: "Hiring practices are in accordance with the Labour Code of Vietnam."
  },
   {
    id: "compliance_ph",
    countryId: "country_ph",
    laborLawReference: "Labor Code of the Philippines",
    dataProtectionRegime: "Data Privacy Act of 2012 (Republic Act No. 10173)",
    equalOpportunityStatement: "Baalvion provides equal employment opportunities to all employees and applicants.",
    hiringDisclosureText: "Hiring practices are in accordance with the Labor Code of the Philippines."
  },
   {
    id: "compliance_ua",
    countryId: "country_ua",
    laborLawReference: "Labour Code of Ukraine",
    dataProtectionRegime: "On Protection of Personal Data",
    equalOpportunityStatement: "Baalvion provides equal employment opportunities to all employees and applicants.",
    hiringDisclosureText: "Hiring practices are in accordance with the Labour Code of Ukraine."
  },
];

export function getComplianceProfileById(id: string): ComplianceProfile | undefined {
    return complianceProfiles.find(p => p.id === id);
}
