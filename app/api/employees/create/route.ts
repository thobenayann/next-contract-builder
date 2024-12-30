import { auth } from '@/app/_lib/auth';
import { prisma } from '@/app/_lib/db';
import { employeeSchema } from '@/app/_lib/validations';
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

        // Récupérer l'organisation active
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
        const validatedData = employeeSchema.parse(body);

        const newEmployee = await prisma.employee.create({
            data: {
                ...validatedData,
                birthdate: new Date(validatedData.birthdate),
                organizationId: user.activeOrganizationId,
                userId: sessionData.session.userId,
            },
        });

        return NextResponse.json(newEmployee);
    } catch (error: any) {
        console.error('Erreur lors de la création:', error);

        // Erreur de validation Zod
        if (error.name === 'ZodError') {
            return NextResponse.json(
                { error: 'Données invalides', issues: error.issues },
                { status: 400 }
            );
        }

        // Erreur Prisma (ex: contrainte unique)
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                return NextResponse.json(
                    {
                        error: 'Un employé avec ce numéro de sécurité sociale existe déjà',
                    },
                    { status: 400 }
                );
            }
        }

        // Autres erreurs
        return NextResponse.json(
            { error: 'Erreur lors de la création' },
            { status: 500 }
        );
    }
}
