import { NextResponse } from 'next/server';

import { prisma } from '@/app/_lib/db';
import { DocumentService } from '@/app/_lib/services/document.service';

export async function GET(
    _request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;

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

        const blob = await DocumentService.generateContract(contract);

        const headers = new Headers();
        headers.set(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        );
        headers.set(
            'Content-Disposition',
            `attachment; filename="contrat_${contract.employee.lastName}_${contract.employee.firstName}.docx"`
        );

        return new NextResponse(blob, {
            status: 200,
            headers,
        });
    } catch (error) {
        console.error('Erreur:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la génération du document' },
            { status: 500 }
        );
    }
}
