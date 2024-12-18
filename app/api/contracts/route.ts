import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';
import type { ContractFormData } from '@/lib/types';

export async function POST(request: Request) {
    try {
        const data = (await request.json()) as ContractFormData;

        // Créer le contrat
        const contract = await prisma.contract.create({
            data: {
                type: data.type,
                startDate: new Date(data.startDate),
                endDate: data.endDate ? new Date(data.endDate) : null,
                employeeId: data.employeeId,
                companyId: '1', // À remplacer par la vraie companyId
            },
        });

        // Associer les clauses au contrat
        if (data.selectedClauses && data.selectedClauses.length > 0) {
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
        console.error('Erreur lors de la création:', error);
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
