import { config } from 'dotenv';
config({ path: process.cwd() + '/.env' });

// Import AI flows
import '@/ai/flows/generate-candidate-summary-flow';
import '@/ai/flows/match-candidate-job-flow';
import '@/ai/flows/parse-resume-flow';
