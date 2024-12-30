import { Suspense } from 'react';

import { prisma } from '@/app/_lib/db';
import { getUserSession } from '@/app/_lib/getUserSession';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading';
import { PageTransition } from '@/components/ui/transition';
import { redirect } from 'next/navigation';

const DashboardPage = async () => {
    const clausesCount = await prisma.clause.count();
    const contractsCount = await prisma.contract.count();
    const userSession = await getUserSession();

    if (!userSession) {
        return redirect('/auth/sign-in');
    }

    return (
        <PageTransition>
            <Suspense fallback={<LoadingSpinner />}>
                <div className='space-y-6'>
                    <h1 className='text-3xl font-bold'>Tableau de bord</h1>
                    <div className='grid gap-4 md:grid-cols-2'>
                        <Card>
                            <CardHeader>
                                <CardTitle>Clauses</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className='text-2xl font-bold'>
                                    {clausesCount}
                                </p>
                                <p className='text-sm text-muted-foreground'>
                                    Clauses créées
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Contrats</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className='text-2xl font-bold'>
                                    {contractsCount}
                                </p>
                                <p className='text-sm text-muted-foreground'>
                                    Contrats générés
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </Suspense>
        </PageTransition>
    );
};

export default DashboardPage;
