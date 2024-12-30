import { Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';

import { prisma } from '@/app/_lib/db';
import { formatSSN } from '@/app/_lib/utils';
import { employeeSchema } from '@/app/_lib/validations/employee';

export async function POST(request: Request) {
    try {
        const data = await request.json();

        // Validation avec Zod
        const validationResult = employeeSchema.safeParse(data);

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    error: 'Données invalides',
                    issues: validationResult.error.issues,
                },
                { status: 400 }
            );
        }

        const formattedSSN = formatSSN(validationResult.data.ssn);

        // Vérification si le SSN existe déjà
        const existingEmployee = await prisma.employee.findFirst({
            where: { ssn: formattedSSN },
        });

        if (existingEmployee) {
            return NextResponse.json(
                {
                    error: 'Ce numéro de sécurité sociale est déjà utilisé',
                    field: 'ssn',
                },
                { status: 400 }
            );
        }

        const newEmployee = await prisma.employee.create({
            data: {
                ...validationResult.data,
                ssn: formattedSSN,
                birthdate: new Date(validationResult.data.birthdate),
                companyId: '1', // À remplacer par la vraie companyId
            },
        });

        return NextResponse.json(newEmployee);
    } catch (error) {
        console.error('Erreur lors de la création:', error);

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                return NextResponse.json(
                    {
                        error: 'Ce numéro de sécurité sociale est déjà utilisé',
                        field: 'ssn',
                    },
                    { status: 400 }
                );
            }
        }

        return NextResponse.json(
            { error: 'Erreur lors de la création' },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const employees = await prisma.employee.findMany({
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
