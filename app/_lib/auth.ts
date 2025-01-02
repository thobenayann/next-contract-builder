import { prisma } from '@/app/_lib/db';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';
import { organization } from 'better-auth/plugins';
import { getBaseUrl } from './auth-client';
import { ac, admin, member, owner } from './permissions';

if (!process.env.BETTER_AUTH_SECRET) {
    throw new Error('BETTER_AUTH_SECRET must be set');
}

export const auth = betterAuth({
    secret: process.env.NEXT_PUBLIC_BETTER_AUTH_SECRET,
    baseURL: getBaseUrl(),
    database: prismaAdapter(prisma, {
        provider: 'postgresql',
    }),
    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
    },
    plugins: [
        organization({
            ac,
            roles: {
                owner,
                admin,
                member,
            },
            allowUserToCreateOrganization: true,
            organizationLimit: 5,
            creatorRole: 'owner',
            membershipLimit: 100,
        }),
        nextCookies(),
    ],
});
