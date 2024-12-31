import { auth } from '@/app/_lib/auth';
import { prisma } from '@/app/_lib/db';
import { getUserSession } from '@/app/_lib/getUserSession';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const sessionData = await auth.api.getSession({
            headers: await headers(),
        });

        if (!sessionData?.session?.userId) {
            return NextResponse.json(
                { error: 'Non authentifié' },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { id: sessionData.session.userId },
            select: { activeOrganizationId: true },
        });

        if (!user?.activeOrganizationId) {
            return NextResponse.json(
                { error: 'Aucune organisation active' },
                { status: 400 }
            );
        }

        const clauses = await prisma.clause.findMany({
            where: {
                organizationId: user.activeOrganizationId,
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
            isOwner: clause.userId === sessionData.session.userId,
            authorName: clause.user.name,
            user: undefined,
        }));

        return NextResponse.json(formattedClauses);
    } catch (error) {
        console.error('Erreur lors de la récupération:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la récupération' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const session = await getUserSession();
        if (!session?.id || !session?.activeOrganizationId) {
            return NextResponse.json(
                { error: "Non authentifié ou pas d'organisation sélectionnée" },
                { status: 401 }
            );
        }

        const data = await request.json();
        const clause = await prisma.clause.create({
            data: {
                ...data,
                userId: session.id,
                organizationId: session.activeOrganizationId,
            },
        });

        return NextResponse.json(clause);
    } catch (error) {
        console.error('Erreur:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la création' },
            { status: 500 }
        );
    }
}
