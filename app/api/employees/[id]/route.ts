import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(_request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const employee = await prisma.employee.findUnique({
            where: { id: params.id },
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

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const data = await request.json();
        const updatedEmployee = await prisma.employee.update({
            where: { id: params.id },
            data: {
                ...data,
                birthdate: new Date(data.birthdate),
            },
        });
        return NextResponse.json(updatedEmployee);
    } catch (error) {
        console.error('Erreur:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la mise à jour' },
            { status: 500 }
        );
    }
}

export async function DELETE(_request: Request, props: { params: Promise<{ id: string }> }) {
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
