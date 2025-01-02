'use client';

import { cn } from '@/app/_lib/utils';
import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
    href?: string;
    width?: number;
    height?: number;
    withSlogan?: boolean;
    className?: string;
}

export const Logo = ({
    href = '/auth/sign-in',
    withSlogan = false,
    width = 96,
    height = 96,
    className,
}: LogoProps) => {
    return (
        <Link
            href={href}
            className='flex items-center gap-2 self-center font-medium text-white/90'
        >
            <div
                className={cn(
                    `flex items-center justify-center rounded-md text-white`,
                    className
                )}
            >
                {withSlogan ? (
                    <Image
                        src='/FeatherLogo-text-white-slogan.png'
                        alt='Logo'
                        priority
                        width={width}
                        height={height}
                        className='object-contain'
                    />
                ) : (
                    <Image
                        src='/FeatherLogo.png'
                        alt='Logo'
                        priority
                        width={width}
                        height={height}
                        className='object-contain'
                    />
                )}
            </div>
        </Link>
    );
};
