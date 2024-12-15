import { ClausesList } from '@/components/ClausesList';
import { prisma } from '@/lib/db';
import { PageTransition } from '@/components/ui/transition';
import { Suspense } from 'react';
import { LoadingSpinner } from '@/components/ui/loading';

export default async function Home() {
    const clauses = await prisma.clause.findMany({
        orderBy: { order: 'asc' },
    });

    return (
        <PageTransition>
            <Suspense fallback={<LoadingSpinner />}>
                <div className="container mx-auto p-4">
                    <ClausesList initialClauses={clauses} />
                </div>
            </Suspense>
        </PageTransition>
    );
}
