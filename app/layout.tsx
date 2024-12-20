import { GeistSans } from 'geist/font/sans';
import type { Metadata } from 'next';

import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';

import './globals.css';
import Providers from './providers';

export const metadata: Metadata = {
    title: 'Éditeur de clauses',
    description: 'Éditeur de clauses de contrat avec drag and drop',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <html
            lang='fr'
            className={GeistSans.className}
            suppressHydrationWarning
        >
            <body>
                <Providers>
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
                </Providers>
                <Toaster />
            </body>
        </html>
    );
};

export default RootLayout;
