/**
 * Mock function to determine the optimal processing region for a given tenant.
 * In a real application, this would involve looking up the tenant's preferred region
 * from a database or configuration.
 *
 * @param tenantId The ID of the tenant (company).
 * @returns A string representing the suggested Google Cloud region (e.g., 'us-central1').
 */
export function getRegionForTenant(tenantId: string): 'us-central1' | 'europe-west1' | 'asia-south1' {
    // This is a mock implementation.
    // A real implementation might look like this:
    // const tenant = await getTenantConfigFromDb(tenantId);
    // switch (tenant.region) {
    //   case 'us': return 'us-central1';
    //   case 'eu': return 'europe-west1';
    //   case 'apac': return 'asia-south1';
    //   default: return 'us-central1';
    // }

    if (tenantId.endsWith('-eu')) {
        return 'europe-west1';
    }
    if (tenantId.endsWith('-apac')) {
        return 'asia-south1';
    }
    return 'us-central1';
}

/**
 * Returns the base URL for a region-specific Cloud Function.
 * @param functionName The name of the Cloud Function.
 * @param region The target Google Cloud region.
 * @returns The full URL for invoking the function.
 */
export function getFunctionUrl(functionName: string, region: string): string {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    return `https://${region}-${projectId}.cloudfunctions.net/${functionName}`;
}

    