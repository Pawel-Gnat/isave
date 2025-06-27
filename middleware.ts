import {
  authRoutes,
  publicRoutes,
  apiAuthPrefix,
  dynamicAuthRoutesPrefix,
  activateAccountRoutePrefix,
  AUTH_REDIRECT,
  LOGIN_REDIRECT,
} from './routes';

import { NextRequest, NextResponse } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

export async function middleware(request: NextRequest) {
  const nextUrl = request.nextUrl;
  const sessionCookie = getSessionCookie(request);

  const isLoggedIn = !!sessionCookie;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute =
    publicRoutes.includes(nextUrl.pathname) ||
    nextUrl.pathname.startsWith(activateAccountRoutePrefix);
  const isAuthRoute =
    authRoutes.includes(nextUrl.pathname) ||
    dynamicAuthRoutesPrefix.some((prefix) => nextUrl.pathname.startsWith(prefix));

  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  if (isAuthRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL(AUTH_REDIRECT, nextUrl));
  }

  if (isPublicRoute && isLoggedIn) {
    return NextResponse.redirect(new URL(LOGIN_REDIRECT, nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
