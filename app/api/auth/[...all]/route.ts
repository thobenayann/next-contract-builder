import { auth } from '@/lib/auth';
import { toNextJsHandler } from 'better-auth/next-js';

const { GET, POST } = toNextJsHandler(auth.handler);

export { GET, POST };
