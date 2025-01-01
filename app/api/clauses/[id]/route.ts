import { NextResponse } from 'next/server';

import { auth } from '@/app/_lib/auth';
import { prisma } from '@/app/_lib/db';
import { headers } from 'next/headers';

export async function GET(
    _request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const clause = await prisma.clause.findUnique({
            where: { id: params.id },
        });

        if (!clause) {
            return NextResponse.json(
                { error: 'Clause non trouvée' },
                { status: 404 }
            );
        }

        return NextResponse.json(clause);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'Erreur lors de la récupération' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const { title, content } = await request.json();
        const updatedClause = await prisma.clause.update({
            where: { id: params.id },
            data: {
                title,
                content,
                updatedAt: new Date(),
            },
        });
        return NextResponse.json(updatedClause);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'Erreur lors de la mise à jour' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;

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

        const clause = await prisma.clause.findUnique({
            where: { id: params.id },
        });

        if (!clause) {
            return NextResponse.json(
                { error: 'Clause non trouvée' },
                { status: 404 }
            );
        }

        if (clause.userId !== sessionData.session.userId) {
            return NextResponse.json(
                { error: 'Non autorisé' },
                { status: 403 }
            );
        }

        await prisma.clause.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ message: 'Clause supprimée avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la suppression' },
            { status: 500 }
        );
    }
}
