import { Suspense } from 'react';

import { prisma } from '@/app/_lib/db';
import { ClausesList } from '@/components/ClausesList';
import { LoadingSpinner } from '@/components/ui/loading';
import { PageTransition } from '@/components/ui/transition';

const ClausesPage = async () => {
    const clauses = await prisma.clause.findMany({
        orderBy: { order: 'asc' },
    });

    return (
        <PageTransition>
            <Suspense fallback={<LoadingSpinner />}>
                <div className='space-y-6'>
                    <h1 className='text-3xl font-bold'>Gestion des clauses</h1>
                    <ClausesList initialClauses={clauses} />
                </div>
            </Suspense>
        </PageTransition>
    );
};

export default ClausesPage;
