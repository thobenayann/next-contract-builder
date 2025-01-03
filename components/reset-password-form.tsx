'use client';

import { authClient } from '@/app/_lib/auth-client';
import { useToast } from '@/app/_lib/hooks/use-toast';
import {
    ResetPasswordInput,
    resetPasswordSchema,
} from '@/app/_lib/validations/schemas/auth.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export const ResetPasswordForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordInput>({
        resolver: zodResolver(resetPasswordSchema),
    });

    const onSubmit = async (data: ResetPasswordInput) => {
        try {
            setIsLoading(true);
            await authClient.resetPassword({
                newPassword: data.newPassword,
            });
            toast({
                title: 'Mot de passe réinitialisé',
                description:
                    'Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.',
            });
            router.push('/auth/sign-in');
        } catch (error) {
            toast({
                title: 'Erreur',
                description: 'Une erreur est survenue. Veuillez réessayer.',
                variant: 'error',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div className='space-y-2 text-center'>
                <h1 className='text-2xl font-semibold tracking-tight text-white'>
                    Réinitialiser le mot de passe
                </h1>
                <p className='text-sm text-muted-foreground'>
                    Entrez votre nouveau mot de passe
                </p>
            </div>

            <div className='space-y-4'>
                <div>
                    <Input
                        {...register('newPassword')}
                        type='password'
                        placeholder='Nouveau mot de passe'
                        disabled={isLoading}
                    />
                    {errors.newPassword && (
                        <p className='mt-1 text-xs text-red-500'>
                            {errors.newPassword.message}
                        </p>
                    )}
                </div>

                <div>
                    <Input
                        {...register('confirmPassword')}
                        type='password'
                        placeholder='Confirmer le mot de passe'
                        disabled={isLoading}
                    />
                    {errors.confirmPassword && (
                        <p className='mt-1 text-xs text-red-500'>
                            {errors.confirmPassword.message}
                        </p>
                    )}
                </div>

                <Button className='w-full' type='submit' disabled={isLoading}>
                    {isLoading && (
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    )}
                    Réinitialiser
                </Button>
            </div>
        </form>
    );
};
