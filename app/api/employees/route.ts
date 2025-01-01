import { auth } from '@/app/_lib/auth';
import { prisma } from '@/app/_lib/db';
import { employeeSchema } from '@/app/_lib/validations';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const sessionData = await auth.api.getSession({
            headers: await headers(),
        });

        if (!sessionData?.session?.userId) {
            return NextResponse.json(
                { error: 'Non authentifié' },
                { status: 401 }
            );
        }

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

        const body = await request.json();
        const validatedData = employeeSchema.parse(body);

        const newEmployee = await prisma.employee.create({
            data: {
                ...validatedData,
                organizationId: user.activeOrganizationId,
                userId: sessionData.session.userId,
            },
        });

        return NextResponse.json(newEmployee);
    } catch (error) {
        // ... gestion des erreurs
    }
}

export async function GET() {
    try {
        const sessionData = await auth.api.getSession({
            headers: await headers(),
        });

        if (!sessionData?.session?.userId) {
            return NextResponse.json(null, { status: 401 });
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

        const employees = await prisma.employee.findMany({
            where: {
                organizationId: user.activeOrganizationId,
            },
            include: {
                contract: true,
            },
            orderBy: {
                lastName: 'asc',
            },
        });

        return NextResponse.json(employees);
    } catch (error) {
        console.error('Erreur lors de la récupération:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la récupération' },
            { status: 500 }
        );
    }
}
