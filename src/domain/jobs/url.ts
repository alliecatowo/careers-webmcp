/** Site-relative URL of the normal job detail page. Shared by normalize.ts and catalog.ts. */
export function jobUrl(countrySlug: string, jobId: string): string {
  return `/careers/countries/${countrySlug}/jobs/${jobId}`;
}
