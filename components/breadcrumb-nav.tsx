'use client';

import Link from 'next/link';

import { useBreadcrumb } from '@/app/_lib/hooks/use-breadcrumb';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export const BreadcrumbNav = () => {
    const breadcrumbs = useBreadcrumb();

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {breadcrumbs.map((crumb) => (
                    <BreadcrumbItem key={crumb.href}>
                        {!crumb.isLast ? (
                            <>
                                <BreadcrumbLink asChild>
                                    <Link href={crumb.href}>{crumb.label}</Link>
                                </BreadcrumbLink>
                                <BreadcrumbSeparator />
                            </>
                        ) : (
                            <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                        )}
                    </BreadcrumbItem>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
};
