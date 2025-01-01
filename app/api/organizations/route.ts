import { auth } from '@/app/_lib/auth';
import { prisma } from '@/app/_lib/db';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const sessionData = await auth.api.getSession({
            headers: await headers(),
        });

        if (!sessionData?.session?.userId) {
            return NextResponse.json(null, { status: 401 });
        }

        const { session } = sessionData;

        // Récupérer l'utilisateur avec son organisation active
        const user = await prisma.user.findUnique({
            where: { id: session.userId },
            include: {
                activeOrganization: true,
            },
        });

        // Si l'utilisateur n'a pas d'organisation active mais a des organisations,
        // définir la première comme active
        if (!user?.activeOrganizationId) {
            const firstOrg = await prisma.organization.findFirst({
                where: {
                    members: {
                        some: { userId: session.userId },
                    },
                },
            });

            if (firstOrg) {
                await Promise.all([
                    // Mettre à jour l'utilisateur
                    prisma.user.update({
                        where: { id: session.userId },
                        data: { activeOrganizationId: firstOrg.id },
                    }),
                    // Mettre à jour la session
                    prisma.session.update({
                        where: { id: session.id },
                        data: { activeOrganizationId: firstOrg.id },
                    }),
                ]);
            }
        }

        // Récupérer toutes les organisations de l'utilisateur
        const organizations = await prisma.organization.findMany({
            where: {
                members: {
                    some: { userId: session.userId },
                },
            },
        });

        return NextResponse.json({
            activeOrg: user?.activeOrganization || organizations[0] || null,
            organizations,
        });
    } catch (error) {
        console.error('Error fetching organizations:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
