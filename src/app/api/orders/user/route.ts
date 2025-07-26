import { NextResponse } from 'next/server';
import { requireUserAuth } from '../../_lib/userSession';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const userId = await requireUserAuth();

    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Fetch user orders error:', error);
    
    if (error instanceof Response) {
      return error;
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
