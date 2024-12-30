import { auth } from '@/app/_lib/auth';
import { User } from '@prisma/client';
import { headers } from 'next/headers';
import { cache } from 'react';

export const getUserSession = cache(async (): Promise<User | null> => {
    const response = await auth.api.getSession({
        headers: await headers(),
    });

    const userSession = response?.user;
    if (!userSession) return null;

    return userSession as User;
});
