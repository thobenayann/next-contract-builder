'use client';

import { ChevronsUpDown, LogOut, Moon, Sun, User } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';

export const NavUser = () => {
    const { isMobile } = useSidebar();
    const { theme, setTheme } = useTheme();

    // if (!session?.user) return null;

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size='lg'
                            className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
                        >
                            <Avatar className='h-8 w-8 rounded-lg'>
                                <AvatarFallback className='rounded-lg'>
                                    <User className='size-4' />
                                </AvatarFallback>
                            </Avatar>
                            <div className='grid flex-1 text-left text-sm leading-tight'>
                                <span className='truncate font-semibold'>
                                    {'Utilisateur'}
                                </span>
                                <span className='truncate text-xs'>
                                    {'email@example.com'}
                                </span>
                            </div>
                            <ChevronsUpDown className='ml-auto size-4' />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
                        side={isMobile ? 'bottom' : 'right'}
                        align='end'
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className='p-0 font-normal'>
                            <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                                <Avatar className='h-8 w-8 rounded-lg'>
                                    <AvatarFallback className='rounded-lg'>
                                        <User className='size-4' />
                                    </AvatarFallback>
                                </Avatar>
                                <div className='grid flex-1 text-left text-sm leading-tight'>
                                    <span className='truncate font-semibold'>
                                        {'Utilisateur'}
                                    </span>
                                    <span className='truncate text-xs'>
                                        {'email@example.com'}
                                    </span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() =>
                                setTheme(theme === 'dark' ? 'light' : 'dark')
                            }
                        >
                            {theme === 'dark' ? (
                                <>
                                    <Sun className='mr-2 size-4' />
                                    Mode clair
                                </>
                            ) : (
                                <>
                                    <Moon className='mr-2 size-4' />
                                    Mode sombre
                                </>
                            )}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => console.log('logout')}>
                            <LogOut className='mr-2 size-4' />
                            Se déconnecter
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
};
