import { auth } from '@/app/_lib/auth';
import { prisma } from '@/app/_lib/db';
import { employeeSchema } from '@/app/_lib/validations/schemas/employee.schema';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(
    _request: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        const sessionData = await auth.api.getSession({
            headers: await headers(),
        });

        if (!sessionData?.session?.userId) {
            return NextResponse.json(
                { error: 'Non authentifié' },
                { status: 401 }
            );
        }

        // Récupérer l'organisation active
        const user = await prisma.user.findUnique({
            where: { id: sessionData.session.userId },
            select: { activeOrganizationId: true },
        });

        if (!user?.activeOrganizationId) {
            return NextResponse.json(
                { error: 'Aucune organisation active' },
                { status: 400 }
            );
        }

        const employee = await prisma.employee.findFirst({
            where: {
                id: params.id,
                organizationId: user.activeOrganizationId,
            },
            include: { contract: true },
        });

        if (!employee) {
            return NextResponse.json(
                { error: 'Employé non trouvé' },
                { status: 404 }
            );
        }

        return NextResponse.json(employee);
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
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        const sessionData = await auth.api.getSession({
            headers: await headers(),
        });

        if (!sessionData?.session?.userId) {
            return NextResponse.json(
                { error: 'Non authentifié' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const validatedData = employeeSchema.safeParse(body);

        if (!validatedData.success) {
            return NextResponse.json(
                {
                    error: 'Données invalides',
                    details: validatedData.error.errors,
                },
                { status: 400 }
            );
        }

        const updatedEmployee = await prisma.employee.update({
            where: { id: params.id },
            data: validatedData.data,
        });

        return NextResponse.json(updatedEmployee);
    } catch (error) {
        console.error('Erreur:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la modification' },
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
        await prisma.employee.delete({
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
