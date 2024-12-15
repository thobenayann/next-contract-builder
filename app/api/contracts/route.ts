import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { name, clauses } = await request.json();

        // Créer le contrat
        const contract = await prisma.contract.create({
            data: {
                name,
            },
        });

        // Mettre à jour l'ordre des clauses
        for (const { id, order } of clauses) {
            await prisma.clause.update({
                where: { id },
                data: {
                    order,
                    contractId: contract.id,
                },
            });
        }

        return NextResponse.json(contract);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'Erreur lors de la création' },
            { status: 500 }
        );
    }
}
