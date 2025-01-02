'use client';

import { usePathname } from 'next/navigation';

const routeNameMap: Record<string, string> = {
    dashboard: 'Dashboard',
    clauses: 'Clauses',
    contracts: 'Contrats',
    employees: 'Employés',
    create: 'Nouveau',
    settings: 'Paramètres',
};

export const useBreadcrumb = () => {
    const pathname = usePathname();
    const segments = pathname.split('/').filter(Boolean);

    const breadcrumbs = segments.map((segment, index) => {
        const href = `/${segments.slice(0, index + 1).join('/')}`;
        const label = routeNameMap[segment] || segment;
        const isLast = index === segments.length - 1;

        return {
            href,
            label,
            isLast,
        };
    });

    return breadcrumbs;
};
