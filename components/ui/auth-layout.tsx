'use client';

import { cn } from '@/app/_lib/utils';
import { Logo } from '@/components/ui/logo';

interface AuthLayoutProps {
    children: React.ReactNode;
    className?: string;
}

export const AuthLayout = ({ children, className }: AuthLayoutProps) => {
    return (
        <div className='relative min-h-svh'>
            <div className='absolute inset-0 bg-gradient-to-br from-black via-purple-950 to-black' />
            <div className='absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,rgba(120,119,198,0.3),transparent)]' />

            <div className='relative flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10'>
                <div
                    className={cn(
                        'flex w-full max-w-sm flex-col gap-6',
                        className
                    )}
                >
                    <Logo
                        withSlogan
                        width={256}
                        height={256}
                        className='w-64 h-64'
                    />
                    {children}
                </div>
            </div>
        </div>
    );
};
