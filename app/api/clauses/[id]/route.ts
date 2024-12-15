import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(
    _request: Request,
    { params }: { params: { id: string } }
) {
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
    { params }: { params: { id: string } }
) {
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
    _request: Request,
    { params }: { params: { id: string } }
) {
    try {
        // Récupérer la clause à supprimer
        const clauseToDelete = await prisma.clause.findUnique({
            where: { id: params.id },
        });

        if (!clauseToDelete) {
            return NextResponse.json(
                { error: 'Clause non trouvée' },
                { status: 404 }
            );
        }

        // Supprimer la clause
        await prisma.clause.delete({
            where: { id: params.id },
        });

        // Réorganiser l'ordre des clauses restantes
        await prisma.clause.updateMany({
            where: {
                order: {
                    gt: clauseToDelete.order,
                },
            },
            data: {
                order: {
                    decrement: 1,
                },
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'Erreur lors de la suppression' },
            { status: 500 }
        );
    }
}
