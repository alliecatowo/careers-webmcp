import { mockAdapter } from './mock';
import { serverAdapter } from './server';
import { ApiAdapter } from './api.adapter';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

export const adapter: ApiAdapter = USE_MOCK ? mockAdapter : serverAdapter;
