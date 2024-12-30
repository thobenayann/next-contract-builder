import { organizationClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import { ac, admin, member, owner } from './permissions';

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
    endpoint: '/api/auth',
    plugins: [
        organizationClient({
            ac,
            roles: {
                owner,
                admin,
                member,
            },
        }),
    ],
});
