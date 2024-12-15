import { ClausesList } from '@/components/ClausesList';
import { prisma } from '@/lib/db';
import { PageTransition } from '@/components/ui/transition';
import { Suspense } from 'react';
import { LoadingSpinner } from '@/components/ui/loading';

export default async function ClausesPage() {
    const clauses = await prisma.clause.findMany({
        orderBy: { order: 'asc' },
    });

    return (
        <PageTransition>
            <Suspense fallback={<LoadingSpinner />}>
                <div className="space-y-6">
                    <h1 className="text-3xl font-bold">Gestion des clauses</h1>
                    <ClausesList initialClauses={clauses} />
                </div>
            </Suspense>
        </PageTransition>
    );
}
