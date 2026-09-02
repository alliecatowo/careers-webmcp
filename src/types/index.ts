
export * from './auth.types';
export * from './user.types';
export * from './candidate.types';
export * from './application.types';
export * from './note.types';
export * from './stageHistory.types';
export * from './notification.types';
export * from './offer.types';
export * from './document.types';
export * from './audit.types';
export * from './payment.types';
export * from './workflow.types';
export * from './compensation.types';
export * from './compliance.types';
export * from './placement.types';

// Aliases for backward compatibility
export type JobFormData = import('@/lib/talent-acquisition/types/job').JobFormData;
export type ApplicationFormData = import('./application.types').MultiPhaseApplicationData;
export type { Job } from '@/lib/talent-acquisition/types/job';
