import { prisma } from '@/app/_lib/db';
import { getSession } from '@/app/_lib/session';
import { contractSchema } from '@/app/_lib/validations/schemas/contract.schema';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const session = await getSession();
        if (!session?.userId) {
            return NextResponse.json(
                { error: 'Non authentifié' },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: { activeOrganization: true },
        });

        if (!user?.activeOrganization) {
            return NextResponse.json(
                { error: 'Aucune organisation active' },
                { status: 400 }
            );
        }

        const data = await request.json();
        const validatedData = contractSchema.parse(data);

        const contract = await prisma.contract.create({
            data: {
                type: validatedData.type,
                startDate: new Date(validatedData.startDate),
                endDate: validatedData.endDate
                    ? new Date(validatedData.endDate)
                    : null,
                employeeId: validatedData.employeeId,
                jobTitle: validatedData.jobTitle,
                classification: validatedData.classification,
                hierarchicalReport: validatedData.hierarchicalReport,
                monthlySalary: validatedData.monthlySalary,
                annualSalary: validatedData.annualSalary,
                variableBonus: validatedData.variableBonus,
                companyVehicle: validatedData.companyVehicle,
                trialPeriod: validatedData.trialPeriod,
                trialPeriodRenewal: validatedData.trialPeriodRenewal,
                organizationId: user.activeOrganization.id,
                userId: session.userId,
                clauses: {
                    create: validatedData.selectedClauses.map(
                        (clause, index) => ({
                            clauseId: clause.id,
                            order: index,
                        })
                    ),
                },
            },
        });

        return NextResponse.json(contract);
    } catch (error) {
        console.error('Erreur:', error);
        return NextResponse.json(
            {
                error:
                    error instanceof Error ? error.message : 'Erreur inconnue',
            },
            { status: 500 }
        );
    }
}
