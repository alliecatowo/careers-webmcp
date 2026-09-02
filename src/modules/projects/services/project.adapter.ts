
import { projectMockService } from './project.mock';
import { projectServerService } from './project.api';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

export const projectService = USE_MOCK ? projectMockService : projectServerService;
