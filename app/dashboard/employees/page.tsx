'use client';

import { useQuery } from '@tanstack/react-query';
import { Suspense } from 'react';

import { EmployeeWithContract } from '@/app/_lib/types';
import { EmployeesList } from '@/components/EmployeesList';
import { LoadingSpinner } from '@/components/ui/loading';
import { PageTransition } from '@/components/ui/transition';

const EmployeesPage = () => {
    const { data: employees, isLoading } = useQuery<EmployeeWithContract[]>({
        queryKey: ['employees'],
        queryFn: async () => {
            const response = await fetch('/api/employees');
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des employés');
            }
            return response.json();
        },
    });

    if (isLoading) return <LoadingSpinner />;

    return (
        <PageTransition>
            <Suspense fallback={<LoadingSpinner />}>
                <div className='space-y-6'>
                    <h1 className='text-3xl font-bold'>Gestion des employés</h1>
                    <EmployeesList initialEmployees={employees || []} />
                </div>
            </Suspense>
        </PageTransition>
    );
};

export default EmployeesPage;
