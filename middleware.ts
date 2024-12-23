import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('next-auth.session-token')?.value;

    // Protection des routes dashboard
    if (pathname.startsWith('/dashboard')) {
        if (!token) {
            const url = new URL('/auth/signin', request.url);
            url.searchParams.set('callbackUrl', encodeURI(request.url));
            return NextResponse.redirect(url);
        }
    }

    // Redirection des utilisateurs connectés
    if (pathname.startsWith('/auth') && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/auth/signin',
        '/auth/signup',
        '/auth/verify',
    ],
};
