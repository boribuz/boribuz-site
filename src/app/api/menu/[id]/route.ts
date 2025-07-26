import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireAdminAuth } from '../../_lib/session';

const prisma = new PrismaClient();

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdminAuth();
    const { id } = await params;
    const data = await req.json();
    const item = await prisma.menuItem.update({
      where: { id: Number(id) },
      data,
    });
    return NextResponse.json(item);
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }
    return NextResponse.json({ error: 'Failed to update menu item' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdminAuth();
    const { id } = await params;
    await prisma.menuItem.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }
    return NextResponse.json({ error: 'Failed to delete menu item' }, { status: 500 });
  }
} 