'use server';

import { notifyGoogle } from '@/lib/googleIndexing';

interface IndexingResult {
  success: boolean;
  message?: string;
  error?: string;
  url?: string;
  type?: string;
}

/**
 * Server action to handle Google Indexing API calls
 * This keeps the secret token on the server side
 */
export async function indexUrl(
  url: string,
  type: 'URL_UPDATED' | 'URL_DELETED',
): Promise<IndexingResult> {
  try {
    // Validate inputs
    if (!url || !url.startsWith('https://')) {
      return {
        success: false,
        error: 'URL must be a valid HTTPS URL',
      };
    }

    if (!['URL_UPDATED', 'URL_DELETED'].includes(type)) {
      return {
        success: false,
        error: 'Type must be either URL_UPDATED or URL_DELETED',
      };
    }

    // Call the Google Indexing API
    const result = await notifyGoogle(url, type);

    return {
      ...result,
      url,
      type,
    };
  } catch (error: any) {
    console.error('Server action indexing error:', error);
    return {
      success: false,
      error: error.message || 'Unknown error occurred',
      url,
      type,
    };
  }
}

/**
 * Server action to handle bulk indexing
 */
export async function indexMultipleUrls(
  urls: string[],
  type: 'URL_UPDATED' | 'URL_DELETED' = 'URL_UPDATED',
): Promise<IndexingResult[]> {
  const results: IndexingResult[] = [];

  // Process URLs with delays to respect rate limits
  for (const url of urls) {
    const result = await indexUrl(url, type);
    results.push(result);

    // Add a small delay between requests
    if (urls.indexOf(url) < urls.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  return results;
}
