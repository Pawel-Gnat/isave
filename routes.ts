/**
 * Public routes - available for all users.
 */

export const publicRoutes = ['/auth', '/activate'];

/**
 * Activate account route prefix.
 */

export const activateAccountRoutePrefix = '/activate';

/**
 * Auth routes - available for authenticated users.
 * These routes will redirect to the /auth page if the user is not authenticated.
 */

export const authRoutes = ['/', '/settings', '/personal'];

/**
 * Dynamic auth routes prefix - available for authenticated users.
 * These routes will redirect to the /auth page if the user is not authenticated.
 */

export const dynamicAuthRoutesPrefix = ['/group', '/statistics'];

/**
 * API auth prefix.
 * This is the prefix for the API routes that handle authentication.
 */

export const apiAuthPrefix = '/api/auth';

/**
 * Default login redirect.
 * This is the default redirect for logged in users.
 */

export const LOGIN_REDIRECT = '/';

/**
 * Default auth redirect.
 * This is the default redirect for logged in users.
 */

export const AUTH_REDIRECT = '/auth';
