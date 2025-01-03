import { prisma } from '@/app/_lib/db';
import { getSession } from '@/app/_lib/session';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const session = await getSession();
        if (!session?.userId) {
            return NextResponse.json(
                { error: 'Non authentifié' },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: {
                activeOrganizationId: true,
                activeOrganization: {
                    include: {
                        members: {
                            select: { userId: true },
                        },
                    },
                },
            },
        });

        if (!user?.activeOrganizationId) {
            return NextResponse.json(
                { error: 'Aucune organisation active' },
                { status: 400 }
            );
        }

        // Récupérer les IDs des membres de l'organisation
        const memberIds =
            user.activeOrganization?.members.map((m) => m.userId) || [];

        const [totalEmployees, totalContracts, totalClauses] =
            await Promise.all([
                prisma.employee.count({
                    where: { organizationId: user.activeOrganizationId },
                }),
                prisma.contract.count({
                    where: { organizationId: user.activeOrganizationId },
                }),
                prisma.clause.count({
                    where: { userId: { in: memberIds } },
                }),
            ]);

        return NextResponse.json({
            totalEmployees,
            totalContracts,
            totalClauses,
        });
    } catch (error) {
        console.error('Erreur:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la récupération des statistiques' },
            { status: 500 }
        );
    }
}
