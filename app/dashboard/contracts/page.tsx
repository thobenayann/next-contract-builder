import { Suspense } from 'react';

import Link from 'next/link';

import { prisma } from '@/app/_lib/db';
import { ContractsList } from '@/components/ContractsList';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading';
import { PageTransition } from '@/components/ui/transition';

const ContractsPage = async () => {
    const [contracts, employeesCount] = await Promise.all([
        prisma.contract.findMany({
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
            },
            orderBy: {
                createdAt: 'desc',
            },
        }),
        prisma.employee.count(),
    ]);

    return (
        <PageTransition>
            <Suspense fallback={<LoadingSpinner />}>
                <div className='space-y-6'>
                    <h1 className='text-3xl font-bold'>Gestion des contrats</h1>
                    {employeesCount === 0 ? (
                        <div className='rounded-lg border border-dashed p-8 text-center'>
                            <h2 className='text-lg font-semibold mb-2'>
                                Aucun employé n&apos;est enregistré
                            </h2>
                            <p className='text-muted-foreground mb-4'>
                                Vous devez d&apos;abord créer un employé avant
                                de pouvoir créer un contrat.
                            </p>
                            <Button asChild>
                                <Link href='/dashboard/employees/create'>
                                    Créer un employé
                                </Link>
                            </Button>
                        </div>
                    ) : (
                        <ContractsList initialContracts={contracts} />
                    )}
                </div>
            </Suspense>
        </PageTransition>
    );
};

export default ContractsPage;
