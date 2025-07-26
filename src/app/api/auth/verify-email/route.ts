import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { setUserSessionCookie } from '../../_lib/userSession';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json({ error: 'Email and verification code are required' }, { status: 400 });
    }

    // Find user with matching email and verification code
    const user = await prisma.user.findFirst({
      where: {
        email,
        verificationCode: code,
        emailVerified: false,
        verificationCodeExpires: {
          gte: new Date() // Code must not be expired
        }
      }
    });

    if (!user) {
      return NextResponse.json({ 
        error: 'Invalid or expired verification code' 
      }, { status: 400 });
    }

    // Update user to verified and clear verification code
    const verifiedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationCode: null,
        verificationCodeExpires: null,
      }
    });

    // Set session cookie to log them in automatically
    await setUserSessionCookie(verifiedUser.id);

    return NextResponse.json({ 
      success: true, 
      message: 'Email verified successfully! You are now logged in.',
      user: {
        id: verifiedUser.id,
        name: verifiedUser.name,
        email: verifiedUser.email,
        isAdmin: verifiedUser.email.endsWith('@admin.boribuz.ca') || 
                verifiedUser.email === 'admin@boribuz.ca' ||
                verifiedUser.email === 'sakib@boribuz.ca'
      }
    });

  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
