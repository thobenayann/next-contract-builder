import { NextResponse } from 'next/server';

import { auth } from '@/auth';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';

export async function POST(request: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    try {
        const data = await request.json();
        const lastClause = await prisma.clause.findFirst({
            orderBy: { order: 'desc' },
            where: { userId: session.user.id },
        });

        const newClause = await prisma.clause.create({
            data: {
                ...data,
                userId: session.user.id,
                order: lastClause ? lastClause.order + 1 : 0,
            },
        });

        return NextResponse.json(newClause);
    } catch (error) {
        console.error('Erreur lors de la création:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la création' },
            { status: 500 }
        );
    }
}

export async function GET() {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    try {
        const clauses = await prisma.clause.findMany({
            where: { userId: session.user.id },
            orderBy: { order: 'asc' },
        });
        return NextResponse.json(clauses);
    } catch (error) {
        console.error('Erreur lors de la récupération:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la récupération' },
            { status: 500 }
        );
    }
}
