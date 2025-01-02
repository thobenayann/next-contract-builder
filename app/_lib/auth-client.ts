import { organizationClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import { ac, admin, member, owner } from './permissions';

// Fonction helper pour obtenir la bonne URL de base
export const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
        // Côté client : utiliser l'URL actuelle
        return window.location.origin;
    }

    // Côté serveur : utiliser la variable d'environnement
    if (process.env.NEXT_PUBLIC_BETTER_AUTH_URL) {
        return process.env.NEXT_PUBLIC_BETTER_AUTH_URL;
    }

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
