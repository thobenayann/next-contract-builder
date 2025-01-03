'use server';

import { auth } from '@/app/_lib/auth';
import { prisma } from '@/app/_lib/db';
import { EmployeeFormData } from '@/app/_lib/validations/schemas/employee.schema';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

export async function createEmployee(data: EmployeeFormData) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.session?.userId) {
        throw new Error('Non authentifié');
    }

    const employee = await prisma.employee.create({
        data: {
            ...data,
            userId: session.session.userId,
            organizationId: session.session.activeOrganizationId!,
        },
    });

    revalidatePath('/dashboard/employees');
    return employee;
}

export async function updateEmployee(id: string, data: EmployeeFormData) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.session?.userId) {
        throw new Error('Non authentifié');
    }

    const employee = await prisma.employee.update({
        where: { id },
        data,
    });

    revalidatePath('/dashboard/employees');
    return employee;
}
