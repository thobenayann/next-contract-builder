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

        // Récupérer l'utilisateur avec son organisation active
        const user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: {
                activeOrganization: true,
            },
        });

        if (!user?.activeOrganization) {
            return NextResponse.json(
                { error: 'Aucune organisation active' },
                { status: 400 }
            );
        }

        const contracts = await prisma.contract.findMany({
            where: {
                organizationId: user.activeOrganization.id,
            },
            include: {
                employee: true,
                user: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        const formattedContracts = contracts.map((contract) => ({
            ...contract,
            isOwner: contract.userId === session.userId,
            authorName: contract.user.name,
            user: undefined,
        }));

        return NextResponse.json(formattedContracts);
    } catch (error) {
        console.error('Erreur:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la récupération' },
            { status: 500 }
        );
    }
}
