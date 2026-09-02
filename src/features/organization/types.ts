export interface Organization {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  plan: "FREE" | "PRO" | "ENTERPRISE";
  createdAt: string;
}
