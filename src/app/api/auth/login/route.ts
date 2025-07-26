import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { setUserSessionCookie } from '../../_lib/userSession';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Check if email is verified (skip for admin users)
    const isAdmin = user.email.endsWith('@admin.boribuz.ca') || 
                   user.email === 'admin@boribuz.ca' ||
                   user.email === 'sakib@boribuz.ca';
    
    if (!isAdmin && !user.emailVerified) {
      return NextResponse.json({ 
        error: 'Please verify your email before logging in',
        needsVerification: true,
        email: user.email
      }, { status: 403 });
    }

    // Set session cookie
    await setUserSessionCookie(user.id, isAdmin);

    return NextResponse.json({ 
      success: true, 
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isVerified: user.emailVerified,
        isAdmin
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
