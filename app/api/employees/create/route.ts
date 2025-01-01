import { auth } from '@/app/_lib/auth';
import { prisma } from '@/app/_lib/db';
import { employeeSchema } from '@/app/_lib/validations';
import { Prisma } from '@prisma/client';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export async function POST(request: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return new NextResponse('Non autorisé', { status: 401 });
        }

        // Récupérer l'organisation active de l'utilisateur
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { activeOrganizationId: true },
        });

        if (!user?.activeOrganizationId) {
            return new NextResponse('Organisation non trouvée', {
                status: 400,
            });
        }

        const json = await request.json();
        if (!json) {
            return new NextResponse('Données manquantes', { status: 400 });
        }

        // Validation des données
        const validatedData = employeeSchema.parse(json);

        const newEmployee = await prisma.employee.create({
            data: {
                ...validatedData,
                birthdate: new Date(validatedData.birthdate),
                userId: session.user.id,
                organizationId: user.activeOrganizationId,
            },
        });

        return NextResponse.json(newEmployee);
    } catch (error) {
        // Gestion spécifique des erreurs Zod
        if (error instanceof ZodError) {
            return NextResponse.json(
                {
                    error: 'Validation failed',
                    details: error.errors,
                },
                { status: 400 }
            );
        }

        // Gestion des erreurs Prisma
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

        // Pour les autres types d'erreurs
        const errorMessage =
            error instanceof Error ? error.message : 'Une erreur est survenue';

        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
