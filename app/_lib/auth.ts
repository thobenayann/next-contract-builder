import { prisma } from '@/app/_lib/db';
import { EmailTemplate } from '@/components/email-template';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: 'postgresql',
    }),
    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
        sendResetPassword: async ({ user, url, token }, request) => {
            try {
                await resend.emails.send({
                    from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
                    to: user.email,
                    subject: 'Réinitialisation de votre mot de passe',
                    react: EmailTemplate({
                        magicLink: url,
                        type: 'reset-password',
                        user: {
                            name: user.name || 'Utilisateur',
                            email: user.email,
                        },
                    }),
                });
                console.log('Reset password email sent successfully');
            } catch (error) {
                console.error('Error sending reset password email:', error);
                throw error;
            }
        },
    },
    plugins: [nextCookies()],
});
