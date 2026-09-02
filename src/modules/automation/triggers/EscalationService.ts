
import { AutomationEscalation } from '../types';

class EscalationService {
  public escalateToRole(jobId: string, role: 'ADMIN' | 'SENIOR_MANAGEMENT', reason: string): AutomationEscalation {
    const escalation: AutomationEscalation = {
      id: `esc-${Date.now()}`,
      jobId,
      escalatedTo: role,
      reason,
      timestamp: new Date(),
    };
    console.log(`[EscalationService] Escalating job ${jobId} to ${role} for reason: ${reason}`);
    return escalation;
  }
}

export const escalationService = new EscalationService();
