'use client';

import { useQuery } from '@tanstack/react-query';

interface DashboardStats {
    totalEmployees: number;
    totalContracts: number;
    totalClauses: number;
}

export function useDashboardStats() {
    return useQuery<DashboardStats>({
        queryKey: ['dashboard-stats'],
        queryFn: async () => {
            const response = await fetch('/api/dashboard/stats');
            if (!response.ok) {
                throw new Error(
                    'Erreur lors de la récupération des statistiques'
                );
            }
            const data = await response.json();
            return data as DashboardStats;
        },
        refetchOnWindowFocus: false,
        staleTime: 0,
    });
}
