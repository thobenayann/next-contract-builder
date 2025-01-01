import { redirect } from 'next/navigation';
import { Suspense } from 'react';

import { prisma } from '@/app/_lib/db';
import { getSession } from '@/app/_lib/session';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading';
import { PageTransition } from '@/components/ui/transition';

const DashboardPage = async () => {
    const session = await getSession();
    const currentUserId = session?.userId;

    // Récupérer l'utilisateur avec son organisation active et les membres
    const user = await prisma.user.findUnique({
        where: { id: currentUserId },
        select: {
            activeOrganization: {
                include: {
                    members: {
                        select: { userId: true },
                    },
                },
            },
        },
    });

    if (!user?.activeOrganization) {
        redirect('/dashboard/organizations');
    }

    // Récupérer les IDs des membres de l'organisation
    const organizationMemberIds = user.activeOrganization.members.map(
        (m) => m.userId
    );

    // Récupérer les statistiques pour l'organisation active
    const [clausesCount, contractsCount] = await Promise.all([
        prisma.clause.count({
            where: {
                userId: { in: organizationMemberIds },
            },
        }),
        prisma.contract.count({
            where: {
                organizationId: user.activeOrganization.id,
            },
        }),
    ]);

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
                                    Clauses créées dans{' '}
                                    {user.activeOrganization.name}
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
                                    Contrats générés dans{' '}
                                    {user.activeOrganization.name}
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
