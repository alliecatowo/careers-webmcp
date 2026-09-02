
import { adapter } from './adapter';

export const organizationService = {
  getUserOrganizations: (userId: string) => adapter.getUserOrganizations(userId),
};
