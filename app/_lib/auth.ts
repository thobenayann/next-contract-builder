import { prisma } from '@/app/_lib/db';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';
import { organization } from 'better-auth/plugins';
import { ac, admin, member, owner } from './permissions';

export const auth = betterAuth({
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
    databaseHooks: {
        session: {
            create: {
                before: async (session) => {
                    const user = await prisma.user.findUnique({
                        where: { id: session.userId },
                        include: {
                            organizations: {
                                include: {
                                    organization: true,
                                },
                            },
                        },
                    });

                    // Utiliser la première organisation comme active si aucune n'est définie
                    const activeOrganization =
                        user?.organizations[0]?.organization;

                    if (activeOrganization) {
                        await prisma.user.update({
                            where: { id: session.userId },
                            data: {
                                activeOrganizationId: activeOrganization.id,
                            },
                        });

                        return {
                            data: {
                                ...session,
                                activeOrganizationId: activeOrganization.id,
                            },
                        };
                    }

                    return { data: session };
                },
            },
        },
    },
});
