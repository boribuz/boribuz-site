import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '../../_lib/emailService';

const prisma = new PrismaClient();

// Generate a 6-digit verification code
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification code and expiration (24 hours from now)
    const verificationCode = generateVerificationCode();
    const verificationCodeExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Create user (not verified yet)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        emailVerified: false,
        verificationCode,
        verificationCodeExpires,
      },
    });

    // Send verification email
    const emailSent = await sendVerificationEmail(email, name, verificationCode);
    
    if (!emailSent) {
      // If email fails in development, still allow registration to proceed
      // In production, consider requiring email verification
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Please check your email and verify your account to complete registration.',
      userId: user.id,
      redirectTo: `/verify-email?email=${encodeURIComponent(email)}`
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
