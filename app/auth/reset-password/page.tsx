import { ResetPasswordForm } from '@/components/reset-password-form';
import { Logo } from '@/components/ui/logo';
import { PageTransition } from '@/components/ui/transition';

const ResetPasswordPage = () => {
    return (
        <PageTransition>
            <div className='relative min-h-svh'>
                <div className='absolute inset-0 bg-gradient-to-br from-black via-purple-950 to-black' />
                <div className='absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,rgba(120,119,198,0.3),transparent)]' />

                <div className='relative flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10'>
                    <div className='flex w-full max-w-sm flex-col gap-6'>
                        <Logo withSlogan width={128} height={128} />
                        <ResetPasswordForm />
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default ResetPasswordPage;
