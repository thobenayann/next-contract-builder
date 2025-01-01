import { prisma } from '@/app/_lib/db';
import { getSession } from '@/app/_lib/session';
import {
    ContractFormData,
    contractSchema,
} from '@/app/_lib/validations/schemas/contract.schema';
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

        // Récupérer l'organisation active
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

        const data = (await request.json()) as ContractFormData;

        // Validation avec Zod
        const validationResult = contractSchema.safeParse(data);
        if (!validationResult.success) {
            return NextResponse.json(
                {
                    error: 'Données invalides',
                    issues: validationResult.error.issues,
                },
                { status: 400 }
            );
        }

        // Créer le contrat
        const contract = await prisma.contract.create({
            data: {
                userId: session.userId,
                organizationId: user.activeOrganization.id,
                type: data.type,
                startDate: new Date(data.startDate),
                endDate: data.endDate ? new Date(data.endDate) : null,
                employeeId: data.employeeId,
            },
        });

        // Créer les associations de clauses
        if (data.selectedClauses?.length > 0) {
            await Promise.all(
                data.selectedClauses.map((clause, index) =>
                    prisma.clausesOnContracts.create({
                        data: {
                            contractId: contract.id,
                            clauseId: clause.id,
                            order: index,
                        },
                    })
                )
            );
        }

        return NextResponse.json(contract);
    } catch (error) {
        console.error('Erreur:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la création' },
            { status: 500 }
        );
    }
}
