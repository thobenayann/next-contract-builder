import { TarnstackQueryProvider } from '@/components/providers/tarnstack-query-provider';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
    title: 'Gestion des contrats',
    description: 'Outil permettant de gérer les contrats de vos entreprises',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <html lang='fr' className='font-sans' suppressHydrationWarning>
            <body>
                <ThemeProvider
                    attribute='class'
                    defaultTheme='system'
                    enableSystem
                    disableTransitionOnChange
                >
                    <main className='min-h-screen bg-background'>
                        <TarnstackQueryProvider>
                            {children}
                        </TarnstackQueryProvider>
                    </main>
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    );
};

export default RootLayout;
