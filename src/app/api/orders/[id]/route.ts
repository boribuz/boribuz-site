import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireAdminAuth } from '../../_lib/session';

const prisma = new PrismaClient();

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdminAuth();
    const { id } = await params;
    const data = await req.json();
    const order = await prisma.order.update({
      where: { id: Number(id) },
      data,
    });
    return NextResponse.json(order);
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
} 