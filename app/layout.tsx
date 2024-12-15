import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
    title: 'Éditeur de clauses',
    description: 'Éditeur de clauses de contrat avec drag and drop',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr" className={GeistSans.className}>
            <body>
                <main className="min-h-screen bg-background transition-all duration-300 ease-in-out">
                    {children}
                </main>
                <Toaster />
            </body>
        </html>
    );
}
