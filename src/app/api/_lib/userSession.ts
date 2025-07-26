import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const USER_SESSION_COOKIE = 'boribuz_user_session';
const JWT_SECRET = process.env.JWT_SECRET || 'changeme'; // Set a strong secret in production
const SESSION_DURATION = 60 * 60 * 24 * 7; // 7 days

export async function setUserSessionCookie(userId: number, isAdmin: boolean = false) {
  const token = jwt.sign({ userId, isAdmin }, JWT_SECRET, { expiresIn: SESSION_DURATION });
  const cookieStore = await cookies();
  cookieStore.set({
    name: USER_SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DURATION,
    secure: process.env.NODE_ENV === 'production',
  });
}

export async function clearUserSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set({
    name: USER_SESSION_COOKIE,
    value: '',
    maxAge: 0,
    path: '/',
  });
}

export async function getUserSessionId(): Promise<number | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(USER_SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: number; isAdmin?: boolean };
    return payload.userId;
  } catch {
    return null;
  }
}

export async function getUserSessionData(): Promise<{ userId: number; isAdmin: boolean } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(USER_SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: number; isAdmin?: boolean };
    return { userId: payload.userId, isAdmin: payload.isAdmin || false };
  } catch {
    return null;
  }
}

export async function requireUserAuth(): Promise<number> {
  const userId = await getUserSessionId();
  if (!userId) {
    throw new Response(JSON.stringify({ error: 'Authentication required' }), { status: 401 });
  }
  return userId;
}
