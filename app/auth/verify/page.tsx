'use client';

import { GalleryVerticalEnd } from 'lucide-react';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

const VerifyPage = () => {
    return (
        <div className='relative min-h-svh'>
            <div className='absolute inset-0 bg-gradient-to-br from-black via-purple-950 to-black' />
            <div className='absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,rgba(120,119,198,0.3),transparent)]' />

            <div className='relative flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10'>
                <div className='flex w-full max-w-sm flex-col gap-6'>
                    <a
                        href='#'
                        className='flex items-center gap-2 self-center font-medium text-white/90'
                    >
                        <div className='flex h-6 w-6 items-center justify-center rounded-md bg-purple-500 text-white'>
                            <GalleryVerticalEnd className='size-4' />
                        </div>
                        Acme Inc.
                    </a>
                    <Card className='border-white/5 bg-black/40 backdrop-blur-xl'>
                        <CardHeader className='text-center'>
                            <CardTitle className='text-xl text-white'>
                                Vérifiez votre email
                            </CardTitle>
                            <CardDescription className='text-gray-400'>
                                Un lien de connexion a été envoyé à votre
                                adresse email.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className='text-center text-gray-300'>
                            Vérifiez votre boîte de réception et cliquez sur le
                            lien pour vous connecter.
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default VerifyPage;
