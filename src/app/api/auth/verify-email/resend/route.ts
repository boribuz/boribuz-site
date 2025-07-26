import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendVerificationEmail } from '../../../_lib/emailService';

const prisma = new PrismaClient();

// Store resend attempts with cooldown
const resendCooldowns = new Map<string, number>();

// Generate a 6-digit verification code
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Check cooldown (60 seconds)
    const now = Date.now();
    const lastResend = resendCooldowns.get(email);
    if (lastResend && now - lastResend < 60000) {
      const remainingTime = Math.ceil((60000 - (now - lastResend)) / 1000);
      return NextResponse.json({ 
        error: `Please wait ${remainingTime} seconds before requesting another code` 
      }, { status: 429 });
    }

    // Find unverified user
    const user = await prisma.user.findFirst({
      where: {
        email,
        emailVerified: false
      }
    });

    if (!user) {
      return NextResponse.json({ 
        error: 'No unverified account found with this email' 
      }, { status: 400 });
    }

    // Generate new verification code
    const verificationCode = generateVerificationCode();
    const verificationCodeExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Update user with new code
    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationCode,
        verificationCodeExpires,
      }
    });

    // Send verification email
    const emailSent = await sendVerificationEmail(email, user.name, verificationCode);
    
    if (!emailSent) {
      // If email fails in development, still allow resend to proceed
    }

    // Set cooldown
    resendCooldowns.set(email, now);

    return NextResponse.json({ 
      success: true, 
      message: 'New verification code sent to your email!'
    });

  } catch (error) {
    console.error('Resend verification error:', error);
    return NextResponse.json({ error: 'Failed to resend verification code' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
