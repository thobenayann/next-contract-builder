import { auth } from '@/app/_lib/auth';
import { Session } from '@prisma/client';
import { headers } from 'next/headers';
import { cache } from 'react';

export const getSession = cache(async (): Promise<Session | null> => {
    const response = await auth.api.getSession({
        headers: await headers(),
    });

    const session = response?.session;
    if (!session) return null;

    return session as Session;
});
