'use client';

import { authClient } from '@/app/_lib/auth-client';
import { useToast } from '@/app/_lib/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
    email: z.string().email('Email invalide'),
});

type FormData = z.infer<typeof schema>;

export const ForgotPasswordForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        try {
            setIsLoading(true);
            await authClient.forgetPassword({
                email: data.email,
                redirectTo: '/auth/reset-password',
            });
            toast({
                title: 'Email envoyé',
                description:
                    'Vérifiez votre boîte de réception pour réinitialiser votre mot de passe.',
            });
            router.push('/auth/verify');
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
                    Mot de passe oublié
                </h1>
                <p className='text-sm text-muted-foreground'>
                    Entrez votre email pour recevoir un lien de réinitialisation
                </p>
            </div>

            <div className='space-y-4'>
                <div>
                    <Input
                        {...register('email')}
                        type='email'
                        placeholder='email@exemple.com'
                        autoComplete='email'
                        disabled={isLoading}
                    />
                    {errors.email && (
                        <p className='mt-1 text-xs text-red-500'>
                            {errors.email.message}
                        </p>
                    )}
                </div>

                <Button className='w-full' type='submit' disabled={isLoading}>
                    {isLoading && (
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    )}
                    Envoyer le lien
                </Button>
            </div>
        </form>
    );
};
