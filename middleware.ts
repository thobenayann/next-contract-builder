import { betterFetch } from '@better-fetch/fetch';
import { Session } from 'better-auth';
import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = ['/dashboard'];
const publicRoutes = ['/auth/sign-in', '/auth/sign-up', '/'];

export default async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Exclure les routes d'API
    if (path.startsWith('/api')) {
        return NextResponse.next();
    }

    const baseURL = request.nextUrl.origin || 'http://localhost:3000';

    const { data: session } = await betterFetch<Session>(
        '/api/auth/get-session',
        {
            baseURL,
            headers: {
                cookie: request.headers.get('cookie') || '',
            },
        }
    );

    // Vérifier si l'utilisateur vient de s'inscrire et n'a pas d'organisation
    if (path === '/dashboard' && session && !session.activeOrganizationId) {
        const searchParams = new URLSearchParams(request.nextUrl.search);
        const orgName = searchParams.get('org');

        if (orgName) {
            // Créer l'organisation via l'API Better Auth
            await betterFetch('/api/auth/organization/create', {
                method: 'POST',
                baseURL,
                headers: {
                    cookie: request.headers.get('cookie') || '',
                },
                body: {
                    name: orgName,
                    slug: orgName.toLowerCase().replace(/\s+/g, '-'),
                },
            });
        }
    }

    if (protectedRoutes.includes(path) && !session) {
        return NextResponse.redirect(new URL('/auth/sign-in', request.nextUrl));
    }

    if (publicRoutes.includes(path) && session) {
        return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard', '/auth/:path*', '/'],
};
