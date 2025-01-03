import { prisma } from '@/app/_lib/db';
import { getSession } from '@/app/_lib/session';
import {
    ContractFormData,
    contractSchema,
} from '@/app/_lib/validations/schemas/contract.schema';
import { Prisma } from '@prisma/client';
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

        // Vérifier si l'employé a déjà un contrat
        const existingContract = await prisma.contract.findUnique({
            where: { employeeId: data.employeeId },
            include: { employee: true },
        });

        if (existingContract) {
            return NextResponse.json(
                {
                    error: 'Contrat existant',
                    message: `Un contrat existe déjà pour ${existingContract.employee.firstName} ${existingContract.employee.lastName}`,
                    code: 'CONTRACT_EXISTS',
                },
                { status: 409 }
            );
        }

        // Créer le contrat
        const contract = await prisma.contract.create({
            data: {
                type: data.type,
                startDate: new Date(data.startDate),
                endDate: data.endDate ? new Date(data.endDate) : null,
                employeeId: data.employeeId,
                organizationId: user.activeOrganization.id,
                userId: session.userId,
            },
        });

        // Créer les associations de clauses
        if (data.selectedClauses?.length > 0) {
            await Promise.all(
                data.selectedClauses.map((clause, index) =>
                    prisma.contractClause.create({
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

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                return NextResponse.json(
                    {
                        error: 'Contrat existant',
                        message: 'Un contrat existe déjà pour cet employé',
                        code: 'CONTRACT_EXISTS',
                    },
                    { status: 409 }
                );
            }
        }

        return NextResponse.json(
            { error: 'Erreur lors de la création' },
            { status: 500 }
        );
    }
}
