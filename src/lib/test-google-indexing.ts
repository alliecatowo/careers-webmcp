/**
 * Simple test script to verify Google Indexing API setup
 * Run this to test your configuration before using the full integration
 */

// Load environment variables from .env files
import { config } from 'dotenv';
config({ path: '.env.local' });
config({ path: '.env' });

async function testGoogleIndexingSetup() {
  console.log('🧪 Testing Google Indexing API setup...\n');

  // Test 1: Check environment variables
  console.log('1. Checking environment variables...');
  const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  const indexingSecret = process.env.GOOGLE_INDEXING_SECRET;

  if (!serviceAccountKey) {
    console.log('❌ GOOGLE_SERVICE_ACCOUNT_KEY is not set');
    return false;
  } else {
    console.log('✅ GOOGLE_SERVICE_ACCOUNT_KEY is set');
  }

  if (!indexingSecret) {
    console.log('❌ GOOGLE_INDEXING_SECRET is not set');
    return false;
  } else {
    console.log('✅ GOOGLE_INDEXING_SECRET is set');
  }

  // Test 2: Validate service account JSON
  console.log('\n2. Validating service account JSON...');
  try {
    const credentials = JSON.parse(serviceAccountKey);
    if (
      credentials.type === 'service_account' &&
      credentials.private_key &&
      credentials.client_email
    ) {
      console.log('✅ Service account JSON is valid');
      console.log(`   Project ID: ${credentials.project_id}`);
      console.log(`   Client Email: ${credentials.client_email}`);
    } else {
      console.log('❌ Service account JSON is missing required fields');
      return false;
    }
  } catch (error) {
    console.log(
      '❌ Service account JSON is invalid:',
      error instanceof Error ? error.message : String(error),
    );
    return false;
  }

  // Test 3: Test Google Indexing Service initialization
  console.log('\n3. Testing Google Indexing Service initialization...');
  try {
    const { createGoogleIndexingService } = await import('./googleIndexing');
    const service = createGoogleIndexingService();
    console.log('✅ Google Indexing Service initialized successfully');
  } catch (error) {
    console.log(
      '❌ Failed to initialize Google Indexing Service:',
      error instanceof Error ? error.message : String(error),
    );
    return false;
  }

  // Test 4: Test API endpoint (if running in development)
  if (process.env.NODE_ENV === 'development') {
    console.log('\n4. Testing API endpoint...');
    try {
      const response = await fetch(
        'http://localhost:3000/api/google-indexing?token=' + indexingSecret,
        {
          method: 'GET',
        },
      );

      if (response.ok) {
        const data = await response.json();
        console.log('✅ API endpoint is accessible');
        console.log(`   Status: ${data.status}`);
      } else {
        console.log(
          `❌ API endpoint returned ${response.status}: ${response.statusText}`,
        );
        return false;
      }
    } catch (error) {
      console.log(
        '⚠️  Could not test API endpoint (server may not be running):',
        error instanceof Error ? error.message : String(error),
      );
      console.log("   This is OK if you're not running the dev server");
    }
  }

  console.log(
    '\n🎉 All tests passed! Your Google Indexing API setup looks good.',
  );
  console.log('\n📝 Next steps:');
  console.log(
    '   1. Make sure your domain is verified in Google Search Console',
  );
  console.log(
    '   2. Test with a real URL using the admin interface at /admin/dev-tools',
  );
  console.log('   3. Run the batch indexing script: npm run index-jobs');

  return true;
}

// Run the test if this file is executed directly
if (require.main === module) {
  testGoogleIndexingSetup().catch((error) => {
    console.error('💥 Test failed:', error);
    process.exit(1);
  });
}

export { testGoogleIndexingSetup };
