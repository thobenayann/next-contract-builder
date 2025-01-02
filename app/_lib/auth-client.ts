import { organizationClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import { ac, admin, member, owner } from './permissions';

if (!process.env.BETTER_AUTH_URL) {
    throw new Error('BETTER_AUTH_URL must be set');
}

export const authClient = createAuthClient({
    baseURL: process.env.BETTER_AUTH_URL,
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
