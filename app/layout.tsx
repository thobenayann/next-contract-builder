import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';

import { SessionProvider } from 'next-auth/react';

import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
    title: 'Éditeur de clauses',
    description: 'Éditeur de clauses de contrat avec drag and drop',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <html lang='fr' className='font-sans' suppressHydrationWarning>
            <body>
                <SessionProvider>
                    <ThemeProvider
                        attribute='class'
                        defaultTheme='system'
                        enableSystem
                        disableTransitionOnChange
                    >
                        <main className='min-h-screen bg-background'>
                            {children}
                        </main>
                    </ThemeProvider>
                </SessionProvider>
                <Toaster />
            </body>
        </html>
    );
};

export default RootLayout;
