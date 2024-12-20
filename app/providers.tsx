'use client';

import { SessionProvider } from 'next-auth/react';

interface ProvidersProps {
    children: React.ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
    return <SessionProvider>{children}</SessionProvider>;
};

export default Providers;
