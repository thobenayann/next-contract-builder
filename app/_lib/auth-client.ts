import { organizationClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import { ac, admin, member, owner } from './permissions';

// Fonction helper pour obtenir la bonne URL de base
const getBaseUrl = () => {
    if (process.env.NEXT_PUBLIC_APP_URL) {
        return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '');
    }

    // En production sur Vercel
    if (process.env.NEXT_PUBLIC_VERCEL_URL) {
        return `https://${process.env.NEXT_PUBLIC_VERCEL_URL.replace(
            /\/$/,
            ''
        )}`;
    }

    // Fallback pour le développement local
    return 'http://localhost:3000';
};

export const authClient = createAuthClient({
    baseURL: getBaseUrl(),
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
