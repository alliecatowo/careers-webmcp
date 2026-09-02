/**
 * Script to manually trigger Google Indexing API for all published jobs
 * Run this script to notify Google about all job URLs
 *
 * Usage:
 * npx tsx src/scripts/index-jobs.ts
 */

import { mockJobs } from '@/mocks/talent-platform/jobs.mock';

const API_ENDPOINT = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const INDEXING_SECRET = process.env.GOOGLE_INDEXING_SECRET;
const BASE_URL = 'https://www.jobs.baalvion.com';

// Country ID to slug mapping
const countrySlugMap: Record<string, string> = {
  country_us: 'united-states',
  country_in: 'india',
  country_gb: 'united-kingdom',
  country_ca: 'canada',
  country_au: 'australia',
  country_pl: 'poland',
};

interface IndexingResponse {
  success: boolean;
  message?: string;
  error?: string;
}

async function indexJob(
  jobUrl: string,
  type: 'URL_UPDATED' | 'URL_DELETED' = 'URL_UPDATED',
): Promise<IndexingResponse> {
  try {
    const response = await fetch(`${API_ENDPOINT}/api/google-indexing`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${INDEXING_SECRET}`,
      },
      body: JSON.stringify({
        url: jobUrl,
        type,
      }),
    });

    const result = await response.json();
    return result;
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

async function indexAllJobs() {
  console.log('🚀 Starting Google Indexing API job submission...\n');

  if (!INDEXING_SECRET) {
    console.error('❌ GOOGLE_INDEXING_SECRET environment variable is required');
    process.exit(1);
  }

  // Filter published jobs only
  const publishedJobs = mockJobs.filter(
    (job) =>
      job.status === 'published' &&
      job.visibility === 'public' &&
      (!job.publishEndDate || new Date(job.publishEndDate) > new Date()),
  );

  console.log(`📊 Found ${publishedJobs.length} published jobs to index\n`);

  let successCount = 0;
  let errorCount = 0;
  const errors: string[] = [];

  // Process jobs in batches to avoid rate limiting
  const BATCH_SIZE = 5;
  const DELAY_MS = 1000; // 1 second delay between batches

  for (let i = 0; i < publishedJobs.length; i += BATCH_SIZE) {
    const batch = publishedJobs.slice(i, i + BATCH_SIZE);

    console.log(
      `Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(
        publishedJobs.length / BATCH_SIZE,
      )}...`,
    );

    const batchPromises = batch.map(async (job) => {
      const countrySlug = countrySlugMap[job.countryId] || 'united-states';
      const jobUrl = `${BASE_URL}/careers/countries/${countrySlug}/jobs/${job.id}`;

      console.log(`  📤 Indexing: ${job.title} (${jobUrl})`);

      const result = await indexJob(jobUrl);

      if (result.success) {
        console.log(`  ✅ Success: ${job.title}`);
        successCount++;
      } else {
        console.log(`  ❌ Failed: ${job.title} - ${result.error}`);
        errorCount++;
        errors.push(`${job.title}: ${result.error}`);
      }

      return result;
    });

    await Promise.all(batchPromises);

    // Add delay between batches (except for the last batch)
    if (i + BATCH_SIZE < publishedJobs.length) {
      console.log(`  ⏳ Waiting ${DELAY_MS}ms before next batch...\n`);
      await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
    }
  }

  // Summary
  console.log('\n📈 Indexing Summary:');
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${errorCount}`);
  console.log(`📊 Total: ${publishedJobs.length}`);

  if (errors.length > 0) {
    console.log('\n❌ Errors:');
    errors.forEach((error) => console.log(`  - ${error}`));
  }

  console.log('\n🎉 Job indexing completed!');
}

// Run the script
if (require.main === module) {
  indexAllJobs().catch((error) => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });
}

export { indexAllJobs, indexJob };
