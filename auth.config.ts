import { EmailTemplate } from '@/components/email-template';
import { prisma } from '@/lib/db';
import { render } from '@react-email/render';
import type { NextAuthConfig } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const authConfig = {
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
                // Vérifier si l'utilisateur existe
                const user = await prisma.user.findUnique({
                    where: { email: identifier },
                });

                if (!user) {
                    throw new Error(
                        "Cet email n'est pas enregistré. Veuillez vous inscrire."
                    );
                }

                const htmlEmail = await render(
                    EmailTemplate({ magicLink: url })
                );

                await resend.emails.send({
                    from: process.env.EMAIL_FROM!,
                    to: identifier,
                    subject: 'Connexion à votre compte',
                    html: htmlEmail,
                });
            },
        }),
    ],
    pages: {
        signIn: '/auth/signin',
        error: '/auth/error',
        verifyRequest: '/auth/verify',
    },
    callbacks: {
        async signIn({ user }) {
            return !!user.email;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.sub as string;
            }
            return session;
        },
        async redirect({ url, baseUrl }) {
            if (url.startsWith('/auth')) {
                return `${baseUrl}/dashboard`;
            }
            return url.startsWith(baseUrl) ? url : baseUrl;
        },
    },
} satisfies NextAuthConfig;
