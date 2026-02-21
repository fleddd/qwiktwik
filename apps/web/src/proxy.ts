import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    const url = request.nextUrl.clone();

    // 1. OAUTH HANDLER: Intercept token from URL query params
    const tokenFromQuery = url.searchParams.get('token');

    if (tokenFromQuery) {
        // Remove token from URL to keep it clean and secure
        url.searchParams.delete('token');

        // Redirect to the clean URL
        const response = NextResponse.redirect(url);

        // Set the token in cookies for future requests (valid for 7 days)
        response.cookies.set('accessToken', tokenFromQuery, {
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
        });

        return response;
    }

    // 2. ROUTE PROTECTION HANDLER
    const token = request.cookies.get('accessToken')?.value;
    const isAuthPage = url.pathname === '/login' || url.pathname === '/signup';
    const isDashboardPage = url.pathname.startsWith('/dashboard');

    // If trying to access dashboard without a token -> send to login
    if (isDashboardPage && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // If trying to access login/signup while already logged in -> send to dashboard
    if (isAuthPage && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/login', '/signup', '/forgot-password'],
};