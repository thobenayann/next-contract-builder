'use client';

import {
    ChevronsUpDown,
    LogOut,
    Moon,
    Sun,
    User as UserIcon,
} from 'lucide-react';
import { useTheme } from 'next-themes';

import { authClient } from '@/app/_lib/auth-client';
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
import { User } from '@prisma/client';
import { useRouter } from 'next/navigation';

interface NavUserProps {
    userSession: User;
}

export const NavUser = ({ userSession }: NavUserProps) => {
    const { isMobile } = useSidebar();
    const { theme, setTheme } = useTheme();
    const router = useRouter();

    if (!userSession) return null;

    const handleLogout = async () => {
        try {
            await authClient.signOut({
                fetchOptions: {
                    onSuccess: () => {
                        router.push('/auth/sign-in');
                    },
                },
            });
        } catch (error) {
            console.error('Failed to logout user:', error);
            throw new Error('Failed to logout user.');
        }
    };

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
                                    <UserIcon className='size-4' />
                                </AvatarFallback>
                            </Avatar>
                            <div className='grid flex-1 text-left text-sm leading-tight'>
                                <span className='truncate font-semibold'>
                                    {userSession.name ?? 'Utilisateur'}
                                </span>
                                <span className='truncate text-xs'>
                                    {userSession.email ?? 'email@example.com'}
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
                                        <UserIcon className='size-4' />
                                    </AvatarFallback>
                                </Avatar>
                                <div className='grid flex-1 text-left text-sm leading-tight'>
                                    <span className='truncate font-semibold'>
                                        {userSession.name ?? 'Utilisateur'}
                                    </span>
                                    <span className='truncate text-xs'>
                                        {userSession.email ??
                                            'email@example.com'}
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
                        <DropdownMenuItem onClick={handleLogout}>
                            <LogOut className='mr-2 size-4' />
                            Se déconnecter
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
};
