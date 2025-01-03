'use client';

import { useDashboardStats } from '@/app/_lib/hooks/use-dashboard-stats';
import { StatsCard } from '@/components/ui/stats-card';
import { PageTransition } from '@/components/ui/transition';
import { FileText, Users } from 'lucide-react';

const DashboardPage = () => {
    const {
        data: stats = { totalEmployees: 0, totalContracts: 0, totalClauses: 0 },
        isLoading,
        isFetching,
    } = useDashboardStats();

    return (
        <PageTransition>
            <div className='flex-1 space-y-4 p-4 md:p-8 pt-6'>
                <div className='flex items-center justify-between space-y-2'>
                    <h2 className='text-3xl font-bold tracking-tight'>
                        Tableau de bord
                    </h2>
                </div>
                <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                    <StatsCard
                        title='Employés'
                        value={stats.totalEmployees}
                        icon={Users}
                        isLoading={isLoading || isFetching}
                    />
                    <StatsCard
                        title='Contrats'
                        value={stats.totalContracts}
                        icon={FileText}
                        isLoading={isLoading || isFetching}
                    />
                    <StatsCard
                        title='Clauses'
                        value={stats.totalClauses}
                        icon={FileText}
                        isLoading={isLoading || isFetching}
                    />
                </div>
            </div>
        </PageTransition>
    );
};

export default DashboardPage;
