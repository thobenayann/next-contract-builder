import { auth } from '@/app/_lib/auth';
import { prisma } from '@/app/_lib/db';
import { clauseSchema } from '@/app/_lib/validations/schemas/clause.schema';
import { Prisma } from '@prisma/client';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
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

        const body = await request.json();

        // Vérifier si une clause avec le même titre existe déjà
        const existingClause = await prisma.clause.findFirst({
            where: {
                title: body.title,
                userId: sessionData.session.userId,
                organizationId: user.activeOrganizationId,
            },
        });

        if (existingClause) {
            return NextResponse.json(
                { error: 'Une clause avec ce titre existe déjà' },
                { status: 400 }
            );
        }

        // Validation Zod
        const validationResult = clauseSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                {
                    error: 'Données invalides',
                    issues: validationResult.error.issues,
                },
                { status: 400 }
            );
        }

        const data = validationResult.data;

        // Trouver la dernière clause pour l'ordre
        const lastClause = await prisma.clause.findFirst({
            where: {
                userId: sessionData.session.userId,
                organizationId: user.activeOrganizationId,
            },
            orderBy: { order: 'desc' },
        });

        const newClause = await prisma.clause.create({
            data: {
                ...data,
                userId: sessionData.session.userId,
                organizationId: user.activeOrganizationId,
                order: lastClause ? lastClause.order + 1 : 0,
            },
        });

        return NextResponse.json(newClause);
    } catch (error) {
        console.error('Erreur lors de la création:', error);

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                return NextResponse.json(
                    { error: 'Une clause avec ce titre existe déjà' },
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
