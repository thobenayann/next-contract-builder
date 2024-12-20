'use client';

import { useState } from 'react';

import { Loader2 } from 'lucide-react';
import { signIn } from 'next-auth/react';
// eslint-disable-next-line import/order
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export const LoginForm = ({
    className,
    ...props
}: React.ComponentPropsWithoutRef<'div'>) => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await signIn('email', {
                email,
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
                    variant: 'default',
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
                        Bienvenue
                    </CardTitle>
                    <CardDescription className='text-gray-400'>
                        Connectez-vous avec votre email
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className='grid gap-6'>
                            <div className='grid gap-2'>
                                <Label
                                    htmlFor='email'
                                    className='text-gray-300'
                                >
                                    Email
                                </Label>
                                <Input
                                    id='email'
                                    type='email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder='m@example.com'
                                    required
                                    className='border-white/10 bg-white/5 text-white placeholder:text-gray-500'
                                />
                            </div>
                            <Button
                                type='submit'
                                className='w-full bg-purple-500 hover:bg-purple-600'
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                        Envoi en cours...
                                    </>
                                ) : (
                                    'Se connecter'
                                )}
                            </Button>
                            <div className='text-center text-sm text-gray-400'>
                                Pas encore de compte ?{' '}
                                <Link
                                    href='/auth/signup'
                                    className='text-purple-400 underline underline-offset-4 hover:text-purple-300'
                                >
                                    Créer un compte
                                </Link>
                            </div>
                        </div>
                    </form>
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
