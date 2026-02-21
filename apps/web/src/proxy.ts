import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
    const url = request.nextUrl.clone();
    const token = request.cookies.get('accessToken')?.value;

    // 1. OAUTH HANDLER (твій код)
    const tokenFromQuery = url.searchParams.get('token');
    if (tokenFromQuery) {
        url.searchParams.delete('token');
        const response = NextResponse.redirect(url);
        response.cookies.set('accessToken', tokenFromQuery, {
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
        });
        return response;
    }

    const isAuthPage = url.pathname === '/login' || url.pathname === '/signup';
    const isDashboardPage = url.pathname.startsWith('/dashboard');

    // 2. ЗАХИСТ: Немає токена -> на логін
    if (isDashboardPage && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // 3. ПЕРЕВІРКА ВАЛІДНОСТІ (щоб уникнути фейкових або прострочених кук)
    if (token) {
        try {
            // Робимо швидкий запит на бек (наш майбутній /users/me)
            const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Якщо бек каже 401 (токен прострочений або недійсний)
            if (!verifyRes.ok) {
                if (isDashboardPage) {
                    const response = NextResponse.redirect(new URL('/login', request.url));
                    response.cookies.delete('accessToken'); // Чистимо "труп" токена
                    return response;
                }
            } else {
                // Якщо токен ОК, а юзер намагається зайти на логін/реєстрацію
                if (isAuthPage) {
                    return NextResponse.redirect(new URL('/dashboard', request.url));
                }
            }
        } catch (err) {
            // Якщо бекенд лежить — краще пропустити, сторінка покаже Error State
            return NextResponse.next();
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/login', '/signup'],
};