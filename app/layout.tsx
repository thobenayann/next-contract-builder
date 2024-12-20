import { GeistSans } from 'geist/font/sans';
import type { Metadata } from 'next';

import { Toaster } from '@/components/ui/toaster';

import './globals.css';
import Providers from './providers';

export const metadata: Metadata = {
    title: 'Éditeur de clauses',
    description: 'Éditeur de clauses de contrat avec drag and drop',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <html lang='fr' className={GeistSans.className}>
            <body>
                <Providers>
                    <main className='min-h-screen bg-background'>
                        {children}
                    </main>
                </Providers>
                <Toaster />
            </body>
        </html>
    );
};

export default RootLayout;
