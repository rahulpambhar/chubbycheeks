import { withAuth } from 'next-auth/middleware';
import { NextRequest, NextResponse } from 'next/server';

export default withAuth(
    (req) => {
        if (req.nextUrl.pathname.startsWith("/admin") && !req.nextauth.token?.isAdmin) {
            return NextResponse.redirect(new URL("/denied", req.url))
        }
        if (req.nextUrl.pathname.startsWith("/orders") && !req.nextauth.token) {
            return NextResponse.redirect(new URL("/denied", req.url))
        }
        if (req.nextUrl.pathname.startsWith("/register") && req.nextauth.token) {
            return NextResponse.redirect(new URL("/", req.url))
        }
        if (req.nextUrl.pathname.startsWith("/checkout") && !req.nextauth.token) {
            return NextResponse.redirect(new URL("/", req.url))
        }
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                if (!token && (['/register', '/checkout', '/orders'].some(path => req.nextUrl.pathname.startsWith(path)))) {
                    return true;
                }
                return token != null
            }
        },
        pages: {
            signIn: '/'
        }
    }
);

export const config = {
    matcher: ['/admin/:path*', "/register", "/checkout/:path*", "/orders"]
};
