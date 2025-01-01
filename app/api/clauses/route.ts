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

        // Récupérer l'organisation active de l'utilisateur
        const user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: {
                activeOrganization: {
                    include: {
                        members: {
                            select: { userId: true },
                        },
                    },
                },
            },
        });

        if (!user?.activeOrganization) {
            return NextResponse.json(
                { error: 'Aucune organisation active' },
                { status: 400 }
            );
        }

        // Récupérer les IDs des membres de l'organisation
        const organizationMemberIds = user.activeOrganization.members.map(
            (m) => m.userId
        );

        // Récupérer toutes les clauses des membres de l'organisation
        const clauses = await prisma.clause.findMany({
            where: {
                userId: { in: organizationMemberIds },
            },
            include: {
                user: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: { order: 'asc' },
        });

        const formattedClauses = clauses.map((clause) => ({
            ...clause,
            isOwner: clause.userId === session.userId,
            authorName: clause.user.name,
            user: undefined,
        }));

        return NextResponse.json(formattedClauses);
    } catch (error) {
        console.error('Erreur:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la récupération' },
            { status: 500 }
        );
    }
}
