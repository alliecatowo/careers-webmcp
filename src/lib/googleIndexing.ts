import { google } from 'googleapis';

interface GoogleIndexingConfig {
  serviceAccountKey: string;
}

interface IndexingResult {
  success: boolean;
  message: string;
  error?: string;
}

/**
 * Server-only utility for Google Indexing API
 * Authenticates using service account and notifies Google of URL changes
 */
export class GoogleIndexingService {
  private auth: any;
  private indexing: any;

  constructor(config: GoogleIndexingConfig) {
    try {
      const credentials = JSON.parse(config.serviceAccountKey);

      this.auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/indexing'],
      });

      this.indexing = google.indexing({ version: 'v3', auth: this.auth });
    } catch (error) {
      console.error('Failed to initialize Google Indexing Service:', error);
      throw new Error('Invalid service account configuration');
    }
  }

  /**
   * Notify Google about URL updates or deletions
   */
  async notifyGoogle(
    url: string,
    type: 'URL_UPDATED' | 'URL_DELETED',
  ): Promise<IndexingResult> {
    try {
      if (!url || !url.startsWith('https://')) {
        return {
          success: false,
          message: 'Invalid URL provided',
          error: 'URL must be a valid HTTPS URL',
        };
      }

      const response = await this.indexing.urlNotifications.publish({
        requestBody: {
          url,
          type,
        },
      });

      console.log(`Google Indexing API notification sent for ${url}:`, {
        type,
        status: response.status,
        data: response.data,
      });

      return {
        success: true,
        message: `Successfully notified Google about ${type} for ${url}`,
      };
    } catch (error: any) {
      console.error('Google Indexing API error:', error);

      return {
        success: false,
        message: 'Failed to notify Google Indexing API',
        error: error.message || 'Unknown error occurred',
      };
    }
  }

  /**
   * Get the status of a URL in Google's index
   */
  async getUrlStatus(url: string): Promise<any> {
    try {
      const response = await this.indexing.urlNotifications.getMetadata({
        url,
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error('Failed to get URL status:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

/**
 * Factory function to create Google Indexing Service instance
 * Uses environment variable for service account key
 */
export function createGoogleIndexingService(): GoogleIndexingService {
  const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

  if (!serviceAccountKey) {
    throw new Error(
      'GOOGLE_SERVICE_ACCOUNT_KEY environment variable is required',
    );
  }

  return new GoogleIndexingService({ serviceAccountKey });
}

/**
 * Convenience function for notifying Google about URL changes
 */
export async function notifyGoogle(
  url: string,
  type: 'URL_UPDATED' | 'URL_DELETED',
): Promise<IndexingResult> {
  try {
    const service = createGoogleIndexingService();
    return await service.notifyGoogle(url, type);
  } catch (error: any) {
    console.error('Failed to create Google Indexing Service:', error);
    return {
      success: false,
      message: 'Service initialization failed',
      error: error.message,
    };
  }
}
