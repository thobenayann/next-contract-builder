'use client';

import { LoginForm } from '@/components/login-form';
import { AuthLayout } from '@/components/ui/auth-layout';

const LoginPage = () => {
    return (
        <AuthLayout>
            <LoginForm />
        </AuthLayout>
    );
};

export default LoginPage;
