import { NextResponse } from 'next/server';

import { prisma } from '@/lib/db';

export async function GET(
    _request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
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
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
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
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        // Vérifier si la clause est utilisée dans des contrats
        const clauseWithContracts = await prisma.clause.findUnique({
            where: { id: params.id },
            include: {
                contracts: {
                    include: {
                        contract: {
                            include: {
                                employee: true,
                            },
                        },
                    },
                },
            },
        });

        if (!clauseWithContracts) {
            return NextResponse.json(
                { error: 'Clause non trouvée' },
                { status: 404 }
            );
        }

        // Si la clause est utilisée dans des contrats
        if (clauseWithContracts.contracts.length > 0) {
            const contractsDetails = clauseWithContracts.contracts.map((c) => ({
                contractId: c.contract.id,
                contractType: c.contract.type,
                employeeName: `${c.contract.employee.lastName} ${c.contract.employee.firstName}`,
                startDate: c.contract.startDate,
            }));

            return NextResponse.json(
                {
                    error: 'Clause utilisée',
                    message:
                        'Cette clause ne peut pas être supprimée car elle est utilisée dans des contrats existants.',
                    contracts: contractsDetails,
                },
                { status: 409 }
            );
        }

        // Si la clause n'est pas utilisée, procéder à la suppression
        await prisma.clause.delete({
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
