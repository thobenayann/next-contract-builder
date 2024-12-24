'use client';

import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { signIn } from 'next-auth/react';

import Link from 'next/link';
import { useForm } from 'react-hook-form';

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
import { cn } from '@/lib/utils';
import { SignUpInput, signUpSchema } from '@/lib/validations/auth.schema';

export const SignUpForm = ({
    className,
    ...props
}: React.ComponentPropsWithoutRef<'div'>) => {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const form = useForm<SignUpInput>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: SignUpInput) => {
        setIsLoading(true);

        try {
            const result = await signIn('email', {
                email: data.email,
                name: data.name,
                redirect: false,
            });

            if (result?.error) {
                toast({
                    title: 'Erreur',
                    description: "Une erreur s'est produite",
                    variant: 'error',
                });
            } else {
                toast({
                    title: 'Email envoyé',
                    description:
                        'Vérifiez votre boîte mail pour vous connecter',
                });
            }
        } catch (error) {
            console.error(error);
            toast({
                title: 'Erreur',
                description: "Une erreur s'est produite",
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
                                    href='/auth/signin'
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
