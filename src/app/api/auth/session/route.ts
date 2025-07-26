import { NextResponse } from 'next/server';
import { getUserSessionId } from '../../_lib/userSession';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const userId = await getUserSessionId();
    
    if (!userId) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Get user details
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
      },
    });

    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Check if user is an admin (based on email domain or specific emails)
    const isAdmin = user.email.endsWith('@admin.boribuz.ca') || 
                   user.email === 'admin@boribuz.ca' ||
                   user.email === 'sakib@boribuz.ca';

    return NextResponse.json({
      authenticated: true,
      user: {
        ...user,
        isAdmin
      },
    });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
