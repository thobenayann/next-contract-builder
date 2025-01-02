'use client';

import { AuthLayout } from '@/components/ui/auth-layout';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

const VerifyPage = () => {
    return (
        <AuthLayout>
            <Card className='border-white/5 bg-black/40 backdrop-blur-xl'>
                <CardHeader className='text-center'>
                    <CardTitle className='text-xl text-white'>
                        Vérifiez votre email
                    </CardTitle>
                    <CardDescription className='text-gray-400'>
                        Un lien de connexion a été envoyé à votre adresse email.
                    </CardDescription>
                </CardHeader>
                <CardContent className='text-center text-gray-300'>
                    Vérifiez votre boîte de réception et cliquez sur le lien
                    pour vous connecter.
                </CardContent>
            </Card>
        </AuthLayout>
    );
};

export default VerifyPage;
