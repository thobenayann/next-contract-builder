import { PrismaAdapter } from '@auth/prisma-adapter';
import { render } from '@react-email/render';
import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import { Resend } from 'resend';

import { EmailTemplate } from '@/components/email-template';
import { prisma } from '@/lib/db';

const resend = new Resend(process.env.RESEND_API_KEY);

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    secret: process.env.AUTH_SECRET,
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.sub as string;
                session.user.name =
                    token.name ||
                    session.user.email?.split('@')[0] ||
                    'Utilisateur';
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.name = user.name;
            }
            return token;
        },
        async redirect({ url, baseUrl }) {
            if (url.includes('/auth/signin') || url.includes('/auth/signup')) {
                return `${baseUrl}/dashboard`;
            }
            return url.startsWith(baseUrl) ? url : baseUrl;
        },
    },
    providers: [
        EmailProvider({
            server: {
                host: process.env.EMAIL_SERVER_HOST,
                port: Number(process.env.EMAIL_SERVER_PORT),
                auth: {
                    user: process.env.EMAIL_SERVER_USER,
                    pass: process.env.RESEND_API_KEY,
                },
            },
            from: process.env.EMAIL_FROM,
            async sendVerificationRequest({ identifier, url }) {
                const cleanUrl = url.replace(/&amp;/g, '&').replace(/"/g, '');
                try {
                    const htmlEmail = await render(
                        EmailTemplate({ magicLink: cleanUrl })
                    );
                    await resend.emails.send({
                        from: process.env.EMAIL_FROM!,
                        to: identifier,
                        subject: 'Connexion à votre compte',
                        html: htmlEmail,
                    });
                } catch (error) {
                    console.error('Error sending email:', error);
                    throw new Error('Failed to send verification email');
                }
            },
        }),
    ],
    pages: {
        signIn: '/auth/signin',
        error: '/auth/error',
        verifyRequest: '/auth/verify',
    },
});
