import { betterFetch } from '@better-fetch/fetch';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from './app/_lib/auth';

const protectedRoutes = ['/dashboard'];
const publicRoutes = ['/auth/sign-in', '/auth/sign-up', '/'];

type Session = typeof auth.$Infer.Session;

export default async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Exclure les routes d'API
    if (path.startsWith('/api')) {
        return NextResponse.next();
    }

    // Utiliser l'URL de la requête actuelle comme base
    const baseURL = request.url.split('/api')[0];

    try {
        const { data: session } = await betterFetch<Session>(
            '/api/auth/get-session',
            {
                baseURL,
                headers: {
                    cookie: request.headers.get('cookie') || '',
                },
            }
        );

        if (protectedRoutes.includes(path) && !session) {
            return NextResponse.redirect(new URL('/auth/sign-in', request.url));
        }

        if (publicRoutes.includes(path) && session) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    } catch (error) {
        // En cas d'erreur de session, rediriger vers la connexion
        if (protectedRoutes.includes(path)) {
            return NextResponse.redirect(new URL('/auth/sign-in', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard', '/auth/:path*', '/'],
};
