'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { authClient } from '@/app/_lib/auth-client';
import { cn } from '@/app/_lib/utils';
import {
    SignInInput,
    signInSchema,
} from '@/app/_lib/validations/schemas/auth.schema';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
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

export const LoginForm = ({
    className,
    ...props
}: React.ComponentPropsWithoutRef<'div'>) => {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const form = useForm<SignInInput>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    async function onSubmit(values: SignInInput) {
        setIsLoading(true);
        const { email, password } = values;

        try {
            const { data, error } = await authClient.signIn.email({
                email,
                password,
                callbackURL: '/dashboard',
            });

            if (error) throw error;

            form.reset();
            toast({
                title: 'Connexion réussie',
                description: 'Vous allez être redirigé...',
            });
        } catch (error: any) {
            toast({
                title: 'Erreur',
                description: error.message,
                variant: 'error',
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card className='border-white/5 bg-black/40 backdrop-blur-xl'>
                <CardHeader className='text-center'>
                    <CardTitle className='text-xl text-white'>
                        Bienvenue
                    </CardTitle>
                    <CardDescription className='text-gray-400'>
                        Connectez-vous avec votre email
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className='space-y-4'
                        >
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
                                                placeholder='m@example.com'
                                                className='border-white/10 bg-white/5 text-white placeholder:text-gray-500'
                                            />
                                        </FormControl>
                                        <FormMessage />
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
                                                placeholder='Votre mot de passe'
                                                className='border-white/10 bg-white/5 text-white placeholder:text-gray-500'
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className='flex items-center justify-between'>
                                <Link
                                    href='/auth/forgot-password'
                                    className='text-sm text-muted-foreground hover:text-primary'
                                >
                                    Mot de passe oublié ?
                                </Link>
                            </div>
                            <Button
                                type='submit'
                                className='w-full bg-purple-500 hover:bg-purple-600'
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                        Connexion en cours...
                                    </>
                                ) : (
                                    'Se connecter'
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className='flex justify-center'>
                    <p className='text-sm text-gray-400'>
                        Pas encore de compte ?{' '}
                        <Link
                            href='/auth/sign-up'
                            className='text-purple-400 underline underline-offset-4 hover:text-purple-300'
                        >
                            Créer un compte
                        </Link>
                    </p>
                </CardFooter>
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
