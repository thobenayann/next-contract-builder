'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    FileText,
    FilePlus,
    Settings,
    FileStack,
    ChevronLeft,
    ChevronRight,
    ScrollText,
} from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

const mainNav = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
        disabled: false,
    },
    {
        title: 'Clauses',
        href: '/dashboard/clauses',
        icon: FileText,
        disabled: false,
    },
    {
        title: 'Nouvelle Clause',
        href: '/clauses/create',
        icon: FilePlus,
        disabled: false,
    },
    {
        title: 'Contrats',
        href: '/dashboard/contracts',
        icon: FileStack,
        disabled: true,
    },
    {
        title: 'Paramètres',
        href: '/dashboard/settings',
        icon: Settings,
        disabled: true,
    },
];

export function AppSidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const NavLink = ({ item }: { item: (typeof mainNav)[0] }) => {
        const content = (
            <Link
                href={item.disabled ? '#' : item.href}
                className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    pathname === item.href
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                    item.disabled && 'pointer-events-none opacity-50'
                )}
            >
                <item.icon className="h-4 w-4" />
                {!isCollapsed && <span>{item.title}</span>}
            </Link>
        );

        if (item.disabled) {
            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>{content}</TooltipTrigger>
                        <TooltipContent>
                            <p>Bientôt disponible</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            );
        }

        return content;
    };

    return (
        <div
            className={cn(
                'fixed top-0 left-0 h-full border-r bg-background transition-all duration-300',
                isCollapsed ? 'w-[60px]' : 'w-[200px]'
            )}
        >
            <div className="flex h-full flex-col">
                <div className="flex h-14 items-center justify-between border-b px-3 py-2">
                    <div className="flex items-center gap-2 overflow-hidden">
                        <ScrollText className="h-6 w-6 shrink-0 text-primary" />
                        {!isCollapsed && (
                            <span className="font-semibold truncate">
                                DocFlow
                            </span>
                        )}
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="ml-auto shrink-0"
                    >
                        {isCollapsed ? (
                            <ChevronRight className="h-4 w-4" />
                        ) : (
                            <ChevronLeft className="h-4 w-4" />
                        )}
                    </Button>
                </div>
                <nav className="flex-1 space-y-1 p-2">
                    {mainNav.map((item, index) => (
                        <NavLink key={index} item={item} />
                    ))}
                </nav>
            </div>
        </div>
    );
}
