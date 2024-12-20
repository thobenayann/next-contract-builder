import { NextResponse } from 'next/server';

import { prisma } from '@/lib/db';
import type { ContractFormData } from '@/lib/types';
import { contractSchema } from '@/lib/validations/schemas/contract.schema';

export async function POST(request: Request) {
    try {
        const data = (await request.json()) as ContractFormData;

        // Validation avec Zod
        const validationResult = contractSchema.safeParse(data);
        if (!validationResult.success) {
            console.error('Erreur de validation:', validationResult.error);
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
                type: data.type,
                startDate: new Date(data.startDate),
                endDate: data.endDate ? new Date(data.endDate) : null,
                employeeId: data.employeeId,
                companyId: '1',
            },
        });

        // Créer les associations de clauses
        if (data.selectedClauses.length > 0) {
            const clauseAssociations = await Promise.all(
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
            console.log('Associations créées:', clauseAssociations);
        }

        return NextResponse.json(contract);
    } catch (error) {
        console.error('Erreur détaillée:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la création' },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const contracts = await prisma.contract.findMany({
            include: {
                employee: true,
                clauses: {
                    include: {
                        clause: true,
                    },
                    orderBy: {
                        order: 'asc',
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return NextResponse.json(contracts);
    } catch (error) {
        console.error('Erreur lors de la récupération:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la récupération' },
            { status: 500 }
        );
    }
}
