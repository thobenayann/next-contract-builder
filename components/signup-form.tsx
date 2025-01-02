'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { authClient } from '@/app/_lib/auth-client';

import { cn } from '@/app/_lib/utils';
import {
    SignUpInput,
    signUpSchema,
} from '@/app/_lib/validations/schemas/auth.schema';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export const SignUpForm = ({
    className,
    ...props
}: React.ComponentPropsWithoutRef<'div'>) => {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<SignUpInput>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            organization: {
                name: '',
            },
        },
    });

    const onSubmit = async (data: SignUpInput) => {
        try {
            setIsLoading(true);

            const response = await fetch('/api/auth/sign-up', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                if (response.status === 409) {
                    if (result.code === 'USER_EXISTS') {
                        form.setError('email', {
                            message: 'Un compte existe déjà avec cet email',
                        });
                    } else if (result.code === 'ORG_EXISTS') {
                        toast({
                            title: 'Organisation déjà existante',
                            description: result.ownerEmail
                                ? `Cette organisation existe déjà. Contactez l'administrateur (${result.ownerEmail}) pour la rejoindre.`
                                : "Cette organisation existe déjà. Contactez l'administrateur pour la rejoindre.",
                            variant: 'error',
                        });
                    }
                    return;
                }
                throw new Error(result.error || "Erreur lors de l'inscription");
            }

            toast({
                title: 'Compte créé avec succès ! 🎉',
                description: 'Redirection vers le tableau de bord...',
                variant: 'success',
            });

            // Se connecter après l'inscription
            const signInResult = await authClient.signIn.email({
                email: data.email,
                password: data.password,
            });

            console.log('signInResult :', signInResult);

            router.push('/dashboard');
        } catch (error) {
            toast({
                title: 'Erreur',
                description:
                    error instanceof Error
                        ? error.message
                        : "Une erreur s'est produite",
                variant: 'error',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card className='border-white/5 bg-black/40 backdrop-blur-xl'>
                <CardHeader className='text-center'>
                    <CardTitle className='text-xl text-white'>
                        Créer un compte
                    </CardTitle>
                    <CardDescription className='text-gray-400'>
                        Inscrivez-vous avec votre email
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className='grid gap-6'
                        >
                            <FormField
                                control={form.control}
                                name='name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='text-gray-300'>
                                            Nom complet
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder='John Doe'
                                                className='border-white/10 bg-white/5 text-white placeholder:text-gray-500'
                                            />
                                        </FormControl>
                                        <FormMessage className='text-red-400' />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='email'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='text-gray-300'>
                                            Email
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type='email'
                                                placeholder='m@example.com'
                                                className='border-white/10 bg-white/5 text-white placeholder:text-gray-500'
                                            />
                                        </FormControl>
                                        <FormMessage className='text-red-400' />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='password'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='text-gray-300'>
                                            Mot de passe
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type='password'
                                                placeholder='********'
                                                className='border-white/10 bg-white/5 text-white placeholder:text-gray-500'
                                            />
                                        </FormControl>
                                        <FormMessage className='text-red-400' />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='organization.name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='text-gray-300'>
                                            Nom de votre organisation
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder='Acme Inc.'
                                                className='border-white/10 bg-white/5 text-white placeholder:text-gray-500'
                                            />
                                        </FormControl>
                                        <FormMessage className='text-red-400' />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type='submit'
                                className='w-full bg-purple-500 hover:bg-purple-600'
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                        Inscription en cours...
                                    </>
                                ) : (
                                    "S'inscrire"
                                )}
                            </Button>
                            <div className='text-center text-sm text-gray-400'>
                                Déjà un compte ?{' '}
                                <Link
                                    href='/auth/sign-in'
                                    className='text-purple-400 underline underline-offset-4 hover:text-purple-300'
                                >
                                    Se connecter
                                </Link>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
            <div className='text-balance text-center text-xs text-gray-500'>
                En continuant, vous acceptez nos{' '}
                <a
                    href='#'
                    className='text-purple-400 underline underline-offset-4 hover:text-purple-300'
                >
                    Conditions d&apos;utilisation
                </a>{' '}
                et notre{' '}
                <a
                    href='#'
                    className='text-purple-400 underline underline-offset-4 hover:text-purple-300'
                >
                    Politique de confidentialité
                </a>
                .
            </div>
        </div>
    );
};
