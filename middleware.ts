import { clerkMiddleware } from '@clerk/nextjs/server';

// Simple middleware that protects all routes by default
export default clerkMiddleware();

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|.*\\.png$|.*\\.jpg$|favicon.ico).*)',
  ],
};
