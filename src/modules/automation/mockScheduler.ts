
import { AutomationEngine } from './AutomationEngine';
import { mockJobsForAutomation } from './mocks/jobs.mock';
import { mockApplicationsForAutomation } from './mocks/applications.mock';
import { AutomationResult } from './types';

export function simulateDailyCron(): AutomationResult {
  console.log("🚀 [Automation] Starting simulated daily cron job...");
  const engine = new AutomationEngine();
  
  // In a real app, you would fetch these from the database
  const jobs = mockJobsForAutomation;
  const applications = mockApplicationsForAutomation;

  const result = engine.run(jobs, applications);

  console.log("✅ [Automation] Cron job finished.");
  console.log(`   - ${result.updatedJobs.length} jobs updated.`);
  console.log(`   - ${result.updatedApplications.length} applications updated.`);
  console.log(`   - ${result.notifications.length} notifications generated.`);
  console.log(`   - ${result.escalations.length} escalations triggered.`);
  console.log(`   - ${result.logs.length} audit logs created.`);

  return result;
}
