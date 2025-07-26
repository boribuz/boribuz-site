import { NextResponse } from 'next/server';
import { clearUserSessionCookie } from '../../_lib/userSession';

export async function POST() {
  await clearUserSessionCookie();
  return NextResponse.json({ success: true });
}
