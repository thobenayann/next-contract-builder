import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';
import type { ContractFormData } from '@/lib/types';

export async function GET(
    _request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const contract = await prisma.contract.findUnique({
            where: { id: params.id },
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
        });

        if (!contract) {
            return NextResponse.json(
                { error: 'Contrat non trouvé' },
                { status: 404 }
            );
        }

        return NextResponse.json(contract);
    } catch (error) {
        console.error('Erreur:', error);
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
        const data = (await request.json()) as ContractFormData;

        // Mettre à jour le contrat
        const updatedContract = await prisma.contract.update({
            where: { id: params.id },
            data: {
                type: data.type,
                startDate: new Date(data.startDate),
                endDate: data.endDate ? new Date(data.endDate) : null,
                employeeId: data.employeeId,
            },
        });

        // Supprimer les anciennes associations de clauses
        await prisma.clausesOnContracts.deleteMany({
            where: { contractId: params.id },
        });

        // Créer les nouvelles associations de clauses
        if (data.selectedClauses && data.selectedClauses.length > 0) {
            await Promise.all(
                data.selectedClauses.map((clause, index) =>
                    prisma.clausesOnContracts.create({
                        data: {
                            contractId: updatedContract.id,
                            clauseId: clause.id,
                            order: index,
                        },
                    })
                )
            );
        }

        return NextResponse.json(updatedContract);
    } catch (error) {
        console.error('Erreur:', error);
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
        // Supprimer d'abord les associations de clauses
        await prisma.clausesOnContracts.deleteMany({
            where: { contractId: params.id },
        });

        // Puis supprimer le contrat
        await prisma.contract.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Erreur:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la suppression' },
            { status: 500 }
        );
    }
}
