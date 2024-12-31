import Link from 'next/link';
import { Suspense } from 'react';

import { prisma } from '@/app/_lib/db';
import { getUserSession } from '@/app/_lib/getUserSession';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading';
import { PageTransition } from '@/components/ui/transition';
import { ClauseWithAuthor, columns } from './columns';
import { DataTable } from './data-table';

const ClausesPage = async () => {
    const session = await getUserSession();
    const currentUserId = session?.id;

    const clauses = await prisma.clause.findMany({
        include: {
            user: {
                select: {
                    name: true,
                    id: true,
                },
            },
        },
        orderBy: { order: 'asc' },
    });

    const formattedClauses: ClauseWithAuthor[] = clauses.map((clause) => ({
        id: clause.id,
        title: clause.title,
        content: clause.content,
        category: clause.category,
        order: clause.order,
        createdAt: clause.createdAt.toISOString(),
        updatedAt: clause.updatedAt.toISOString(),
        isOwner: clause.userId === currentUserId,
        authorName: clause.user.name,
    }));

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
                    <DataTable columns={columns} data={formattedClauses} />
                </div>
            </Suspense>
        </PageTransition>
    );
};

export default ClausesPage;
