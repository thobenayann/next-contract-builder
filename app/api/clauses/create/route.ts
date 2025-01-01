import { Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';

import { prisma } from '@/app/_lib/db';
import { getSession } from '@/app/_lib/session';
import { clauseSchema } from '@/app/_lib/validations/schemas/clause.schema';

export async function POST(request: Request) {
    try {
        const session = await getSession();
        if (!session?.userId) {
            return NextResponse.json(
                { error: 'Non authentifié' },
                { status: 401 }
            );
        }

        const data = await request.json();

        // Validation des données
        const validationResult = clauseSchema.safeParse(data);
        if (!validationResult.success) {
            return NextResponse.json(
                {
                    error: 'Données invalides',
                    issues: validationResult.error.issues,
                },
                { status: 400 }
            );
        }

        // Vérifier si une clause avec le même titre existe déjà pour cet utilisateur
        const existingClause = await prisma.clause.findFirst({
            where: {
                title: validationResult.data.title,
                userId: session.userId,
            },
        });

        if (existingClause) {
            return NextResponse.json(
                { error: 'Vous avez déjà une clause avec ce titre' },
                { status: 400 }
            );
        }

        // Créer la clause
        const clause = await prisma.clause.create({
            data: {
                ...validationResult.data,
                userId: session.userId,
                order: 0, // On peut simplement mettre 0 car l'ordre n'est pas utilisé
            },
        });

        return NextResponse.json(clause);
    } catch (error) {
        console.error('Erreur:', error);

        // Gestion des erreurs Prisma
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                return NextResponse.json(
                    { error: 'Vous avez déjà une clause avec ce titre' },
                    { status: 400 }
                );
            }
        }

        return NextResponse.json(
            { error: 'Erreur lors de la création' },
            { status: 500 }
        );
    }
}
