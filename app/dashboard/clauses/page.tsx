'use client';

import Link from 'next/link';
import { Suspense } from 'react';

import { useClauses } from '@/app/_lib/hooks/use-clauses';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading';
import { PageTransition } from '@/components/ui/transition';
import { columns } from './components/columns';
import { DataTable } from './components/data-table';

const ClausesPage = () => {
    const { clauses, isLoading, isError } = useClauses();

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (isError) {
        return (
            <div className='p-4 text-red-500'>
                Une erreur est survenue lors du chargement des clauses.
            </div>
        );
    }

    return (
        <PageTransition>
            <Suspense fallback={<LoadingSpinner />}>
                <div className='space-y-6'>
                    <div className='flex justify-between items-center'>
                        <h1 className='text-3xl font-bold'>
                            Gestion des clauses
                        </h1>
                        <Link href='/dashboard/clauses/create'>
                            <Button>Nouvelle clause</Button>
                        </Link>
                    </div>
                    <DataTable columns={columns} data={clauses || []} />
                </div>
            </Suspense>
        </PageTransition>
    );
};

export default ClausesPage;
