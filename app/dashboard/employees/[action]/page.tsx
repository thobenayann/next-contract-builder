import { auth } from '@/app/_lib/auth';
import { prisma } from '@/app/_lib/db';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { EmployeeForm } from './employee-form';

interface Props {
    params: Promise<{
        action: 'create' | 'edit';
    }>;
    searchParams: Promise<{
        id?: string;
    }>;
}

const EmployeePage = async ({ params, searchParams }: Props) => {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.session?.userId) return notFound();

    // Attendre la résolution des promesses
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;

    let initialData = null;
    if (resolvedParams.action === 'edit' && resolvedSearchParams.id) {
        initialData = await prisma.employee.findUnique({
            where: { id: resolvedSearchParams.id },
            include: { contract: true },
        });
    }

    return (
        <EmployeeForm
            action={resolvedParams.action}
            initialData={initialData}
        />
    );
};

export default EmployeePage;
