'use client';

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@radix-ui/react-collapsible';
import {
    ChevronDown,
    FilePlus,
    FileStack,
    FileText,
    LayoutDashboard,
    Settings,
    Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { cn } from '@/app/_lib/utils';
import { Logo } from '@/components/ui/logo';
import { NavUser } from '@/components/ui/nav-user';
import { SidebarProvider } from '@/components/ui/sidebar';
import { User } from '@prisma/client';
import { OrganizationSwitcher } from './organization-switcher';

interface SubmenuItem {
    title: string;
    href: string;
    icon: React.ElementType;
}

interface MainNavItem {
    title: string;
    href?: string;
    icon: React.ElementType;
    disabled?: boolean;
    submenu?: SubmenuItem[];
}

interface AppSidebarClientProps {
    userSession: User | null;
}

const mainNav: MainNavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
        disabled: false,
    },
    {
        title: 'Clauses',
        icon: FileText,
        disabled: false,
        submenu: [
            {
                title: 'Liste des clauses',
                href: '/dashboard/clauses',
                icon: FileText,
            },
            {
                title: 'Nouvelle clause',
                href: '/dashboard/clauses/create',
                icon: FilePlus,
            },
        ],
    },
    {
        title: 'Contrats',
        icon: FileStack,
        disabled: false,
        submenu: [
            {
                title: 'Liste des contrats',
                href: '/dashboard/contracts',
                icon: FileStack,
            },
            {
                title: 'Nouveau contrat',
                href: '/dashboard/contracts/create',
                icon: FilePlus,
            },
        ],
    },
    {
        title: 'Employés',
        icon: Users,
        disabled: false,
        submenu: [
            {
                title: 'Liste des employés',
                href: '/dashboard/employees',
                icon: Users,
            },
            {
                title: 'Nouvel employé',
                href: '/dashboard/employees/create',
                icon: FilePlus,
            },
        ],
    },
    {
        title: 'Paramètres',
        href: '/dashboard/settings',
        icon: Settings,
        disabled: true,
    },
];

export const AppSidebarClient = ({ userSession }: AppSidebarClientProps) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const pathname = usePathname();

    const NavLink = ({ item }: { item: (typeof mainNav)[0] }) => {
        if (item.submenu) {
            return (
                <Collapsible className='group/collapsible'>
                    <CollapsibleTrigger
                        className={cn(
                            'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                            'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                        )}
                    >
                        <item.icon className='h-4 w-4' />
                        {!isCollapsed && (
                            <>
                                <span>{item.title}</span>
                                <ChevronDown className='ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180' />
                            </>
                        )}
                    </CollapsibleTrigger>
                    <CollapsibleContent className='data-[state=open]:animate-slide-down data-[state=closed]:animate-slide-up overflow-hidden'>
                        {item.submenu.map((subItem: SubmenuItem) => (
                            <Link
                                key={subItem.href}
                                href={subItem.href}
                                className={cn(
                                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors pl-8',
                                    pathname === subItem.href
                                        ? 'bg-accent text-accent-foreground'
                                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                )}
                            >
                                <subItem.icon className='h-4 w-4' />
                                {!isCollapsed && <span>{subItem.title}</span>}
                            </Link>
                        ))}
                    </CollapsibleContent>
                </Collapsible>
            );
        }

        return (
            <Link
                href={item.href || '#'}
                className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    pathname === item.href
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                    item.disabled && 'pointer-events-none opacity-50'
                )}
            >
                <item.icon className='h-4 w-4' />
                {!isCollapsed && <span>{item.title}</span>}
            </Link>
        );
    };

    return (
        <div className='fixed inset-y-0 z-50 flex w-[200px] flex-col'>
            <SidebarProvider>
                <div className='flex h-full flex-1 flex-col border-r bg-background'>
                    <div className='flex items-center justify-center p-2'>
                        <Logo />
                    </div>
                    <div className='p-2'>
                        <OrganizationSwitcher />
                    </div>

                    <nav className='flex-1 space-y-1 p-2'>
                        {mainNav.map((item, index) => (
                            <NavLink key={index} item={item} />
                        ))}
                    </nav>

                    <div className='border-t p-2'>
                        {userSession ? (
                            <NavUser userSession={userSession} />
                        ) : null}
                    </div>
                </div>
            </SidebarProvider>
        </div>
    );
};
