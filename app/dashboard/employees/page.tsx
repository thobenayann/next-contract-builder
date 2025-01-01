import { Suspense } from 'react';

import { prisma } from '@/app/_lib/db';
import { EmployeesList } from '@/components/EmployeesList';
import { LoadingSpinner } from '@/components/ui/loading';
import { PageTransition } from '@/components/ui/transition';

const EmployeesPage = async () => {
    const employees = await prisma.employee.findMany({
        include: {
            contract: true,
        },
        orderBy: {
            lastName: 'asc',
        },
    });

    return (
        <PageTransition>
            <Suspense fallback={<LoadingSpinner />}>
                <div className='space-y-6'>
                    <h1 className='text-3xl font-bold'>Gestion des employés</h1>
                    <EmployeesList initialEmployees={employees} />
                </div>
            </Suspense>
        </PageTransition>
    );
};

export default EmployeesPage;
