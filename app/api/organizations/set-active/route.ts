import { prisma } from '@/app/_lib/db';
import { getSession } from '@/app/_lib/session';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const session = await getSession();
        if (!session?.userId) {
            return NextResponse.json(
                { error: 'Non authentifié' },
                { status: 401 }
            );
        }

        const { organizationId } = await request.json();

        // Vérifier que l'utilisateur est membre de cette organisation
        const membership = await prisma.member.findFirst({
            where: {
                userId: session.userId,
                organizationId,
            },
        });

        if (!membership) {
            return NextResponse.json(
                { error: 'Non autorisé' },
                { status: 403 }
            );
        }

        // Mettre à jour l'organisation active de l'utilisateur
        await prisma.user.update({
            where: { id: session.userId },
            data: { activeOrganizationId: organizationId },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Erreur:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
