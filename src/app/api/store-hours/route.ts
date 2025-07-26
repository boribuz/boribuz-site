import { NextResponse } from 'next/server';
import { checkStoreHours } from '../_lib/orderValidation';

export async function GET() {
  try {
    const storeStatus = await checkStoreHours();
    return NextResponse.json(storeStatus);
  } catch (error) {
    console.error('Error fetching store hours:', error);
    return NextResponse.json({ error: 'Failed to fetch store hours' }, { status: 500 });
  }
}
