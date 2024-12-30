import { ForgotPasswordForm } from '@/components/forgot-password-form';
import { PageTransition } from '@/components/ui/transition';
import { GalleryVerticalEnd } from 'lucide-react';
import Link from 'next/link';

const ForgotPasswordPage = () => {
    return (
        <PageTransition>
            <div className='relative min-h-svh'>
                <div className='absolute inset-0 bg-gradient-to-br from-black via-purple-950 to-black' />
                <div className='absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,rgba(120,119,198,0.3),transparent)]' />

                <div className='relative flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10'>
                    <div className='flex w-full max-w-sm flex-col gap-6'>
                        <Link
                            href='/auth/sign-in'
                            className='flex items-center gap-2 self-center font-medium text-white/90'
                        >
                            <div className='flex h-6 w-6 items-center justify-center rounded-md bg-purple-500 text-white'>
                                <GalleryVerticalEnd className='size-4' />
                            </div>
                            Acme Inc.
                        </Link>
                        <ForgotPasswordForm />
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default ForgotPasswordPage;
