import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const USER_SESSION_COOKIE = 'boribuz_user_session';
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

// Admin email patterns
const ADMIN_EMAILS = [
  'admin@boribuz.ca',
  'sakib@boribuz.ca'
];

function isAdminEmail(email: string): boolean {
  return email.endsWith('@admin.boribuz.ca') || ADMIN_EMAILS.includes(email);
}

export async function middleware(request: NextRequest) {
  // Only apply middleware to admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Get the session token from cookies
    const sessionToken = request.cookies.get(USER_SESSION_COOKIE)?.value;
    
    if (!sessionToken) {
      // No session token - redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    try {
      // Verify the JWT token
      const decoded = jwt.verify(sessionToken, JWT_SECRET) as { userId: number; isAdmin?: boolean };
      
      // Check if user is admin
      if (!decoded.isAdmin) {
        // Not an admin - redirect to login
        return NextResponse.redirect(new URL('/login', request.url));
      }
      
      // User is authenticated and is admin - allow access
      return NextResponse.next();
    } catch (error) {
      // Invalid token - redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  // For all other routes, continue normally
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
};
