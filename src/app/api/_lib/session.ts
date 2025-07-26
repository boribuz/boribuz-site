import { getUserSessionId } from './userSession';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function setSessionCookie(userId: number): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set('admin_session_id', userId.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 // 7 days
  });
}

export async function requireAdminAuth(): Promise<number> {
  const userId = await getUserSessionId();
  
  if (!userId) {
    throw new Response(JSON.stringify({ error: 'Authentication required' }), { status: 401 });
  }

  // Check if user is an admin
  const user = await prisma.user.findUnique({ where: { id: userId } });
  
  if (!user) {
    throw new Response(JSON.stringify({ error: 'User not found' }), { status: 401 });
  }

  const isAdmin = user.email.endsWith('@admin.boribuz.ca') || 
                 user.email === 'admin@boribuz.ca' ||
                 user.email === 'sakib@boribuz.ca';

  if (!isAdmin) {
    throw new Response(JSON.stringify({ error: 'Admin access required' }), { status: 403 });
  }

  return userId;
} 