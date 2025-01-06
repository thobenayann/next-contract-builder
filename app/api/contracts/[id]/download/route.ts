import { prisma } from '@/app/_lib/db';
import { DocumentService } from '@/app/_lib/services/document.service';
import { getSession } from '@/app/_lib/session';
import { NextResponse } from 'next/server';

export async function GET(
    _request: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session?.userId) {
            return NextResponse.json(
                { error: 'Non authentifié' },
                { status: 401 }
            );
        }

        const params = await props.params;
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
                organization: true,
            },
        });

        if (!contract) {
            return NextResponse.json(
                { error: 'Contrat non trouvé' },
                { status: 404 }
            );
        }

        // Vérifier que l'utilisateur a accès à ce contrat
        if (contract.organizationId !== session.activeOrganizationId) {
            return NextResponse.json(
                { error: 'Non autorisé' },
                { status: 403 }
            );
        }

        const buffer = await DocumentService.generateContract(contract);

        const headers = new Headers();
        headers.set(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        );
        headers.set(
            'Content-Disposition',
            `attachment; filename="contrat_${contract.employee.lastName}_${contract.employee.firstName}.docx"`
        );

        return new NextResponse(buffer, {
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
