# Google Indexing API Integration

This document explains how to set up and use the Google Indexing API integration for the Baalvion job portal.

## Overview

The Google Indexing API allows you to notify Google when pages are added, updated, or deleted on your website. This helps ensure that your job listings are quickly discovered and indexed by Google Search.

## Features

- ✅ Server-only Google Indexing API integration
- ✅ Secure API route with token authentication
- ✅ Structured data (JSON-LD) for job postings
- ✅ Bulk URL indexing support
- ✅ Admin interface for manual triggering
- ✅ Automated script for batch processing
- ✅ Error handling and logging

## Setup Instructions

### 1. Enable Google Indexing API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google Indexing API**
4. Go to **APIs & Services > Credentials**
5. Click **Create Credentials > Service Account**
6. Fill in the service account details
7. Download the JSON key file

### 2. Configure Environment Variables

Copy `.env.local.example` to `.env.local` and fill in the values:

```bash
# Service Account JSON Key (stringified)
GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"your-project-id",...}'

# Secret token for API protection
GOOGLE_INDEXING_SECRET=your-super-secret-token-here

# App URL for API calls
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important**:

- Stringify the entire JSON key file content
- Use a strong, random secret token
- Never commit these values to version control

### 3. Verify Setup

1. Start your development server: `npm run dev`
2. Navigate to `/admin/dev-tools`
3. Use the "Google Indexing API" section to test the integration

## Usage

### Manual Indexing (Admin Interface)

1. Go to `/admin/dev-tools`
2. Scroll to the "Google Indexing API" section
3. **Single URL**: Enter a job URL and select action type
4. **Bulk URLs**: Enter multiple URLs (one per line) or use "Generate Sample URLs"
5. Click submit to notify Google

### Automated Script

Run the indexing script to process all published jobs:

```bash
# Using npx with tsx
npx tsx src/scripts/index-jobs.ts

# Or add to package.json scripts
npm run index-jobs
```

### API Endpoint

The API endpoint is available at `/api/google-indexing`:

```bash
# Example curl request
curl -X POST http://localhost:3000/api/google-indexing \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-secret-token" \
  -d '{
    "url": "https://www.jobs.baalvion.com/careers/countries/india/jobs/job-1",
    "type": "URL_UPDATED"
  }'
```

### Programmatic Usage

```typescript
import { notifyGoogle } from '@/lib/googleIndexing';

// Notify Google about a new or updated job
const result = await notifyGoogle(
  'https://www.jobs.baalvion.com/careers/countries/india/jobs/job-1',
  'URL_UPDATED',
);

if (result.success) {
  console.log('Successfully notified Google');
} else {
  console.error('Failed:', result.error);
}
```

## File Structure

```
src/
├── lib/
│   ├── googleIndexing.ts          # Core Google Indexing API service
│   └── structured-data.ts         # JSON-LD structured data generator
├── app/
│   └── api/
│       └── google-indexing/
│           └── route.ts           # Protected API endpoint
├── components/
│   └── admin/
│       └── GoogleIndexingTrigger.tsx  # Admin UI component
├── scripts/
│   └── index-jobs.ts             # Batch indexing script
└── app/(public)/careers/countries/[slug]/jobs/[jobId]/
    └── page.tsx                  # Job detail page with structured data
```

## Structured Data

Each job detail page automatically includes JSON-LD structured data following schema.org JobPosting specification:

```json
{
  "@context": "https://schema.org",
  "@type": "JobPosting",
  "title": "Senior Frontend Engineer",
  "description": "Job description...",
  "datePosted": "2024-01-01T00:00:00.000Z",
  "validThrough": "2024-02-01T00:00:00.000Z",
  "employmentType": "FULL_TIME",
  "hiringOrganization": {
    "@type": "Organization",
    "name": "Baalvion",
    "sameAs": "https://www.baalvion.com"
  },
  "jobLocation": {
    "@type": "Place",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Bengaluru",
      "addressRegion": "Karnataka",
      "addressCountry": "IN"
    }
  }
}
```

## Security Considerations

- ✅ Service account credentials are server-only
- ✅ API endpoint is protected with secret token
- ✅ Input validation and sanitization
- ✅ Rate limiting through batch processing
- ✅ Error handling and logging

## Troubleshooting

### Common Issues

1. **"Service account configuration error"**

   - Verify `GOOGLE_SERVICE_ACCOUNT_KEY` is properly stringified JSON
   - Ensure the service account has Indexing API permissions

2. **"Unauthorized" error**

   - Check `GOOGLE_INDEXING_SECRET` matches in requests
   - Verify the secret is set in environment variables

3. **"Invalid URL" error**

   - URLs must be HTTPS
   - URLs must be from your verified domain in Google Search Console

4. **Rate limiting**
   - The script includes delays between batches
   - Google has daily quotas for the Indexing API

### Debugging

Enable detailed logging by checking the server console for:

- API request/response details
- Google Indexing API responses
- Error messages and stack traces

## Best Practices

1. **Verify Domain Ownership**: Ensure your domain is verified in Google Search Console
2. **Use Sparingly**: Only notify Google about significant changes
3. **Monitor Quotas**: Keep track of your API usage
4. **Test First**: Use the admin interface to test before automation
5. **Handle Errors**: Implement proper error handling in production

## Production Deployment

1. Set production environment variables
2. Update `NEXT_PUBLIC_APP_URL` to your production domain
3. Verify domain ownership in Google Search Console
4. Test the integration with a few URLs first
5. Set up monitoring for API errors

## API Limits

- **Daily quota**: 200 URLs per day (as of 2024)
- **Rate limits**: Reasonable delays between requests
- **URL requirements**: Must be from verified domain

For the latest limits, check the [Google Indexing API documentation](https://developers.google.com/search/apis/indexing-api/v3/quota-pricing).
