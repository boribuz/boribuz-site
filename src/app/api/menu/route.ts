import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminAuth } from '../_lib/session';

export async function GET() {
  try {
    const items = await prisma.menuItem.findMany({
      where: {
        available: true // Only return available items for public menu
      }
    });
    
    // Parse JSON fields for each item and format for frontend
    const itemsWithParsedData = items.map((item: {
      id: number;
      itemId: string | null;
      name: string;
      description: string;
      price: number;
      category: string;
      image: string | null;
      imageUrl: string | null;
      available: boolean;
      featured: boolean;
      ingredients: string | null;
      allergens: string | null;
      calories: number | null;
      protein: number | null;
      carbs: number | null;
      fat: number | null;
      preparationTime: string | null;
      spiceLevel: string | null;
      isVegetarian: boolean;
      isVegan: boolean;
      isGlutenFree: boolean;
    }) => ({
      id: item.itemId || item.id.toString(),
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image: item.image,
      imageUrl: item.imageUrl,
      isVegetarian: item.isVegetarian,
      isSpicy: item.spiceLevel === 'hot' || item.spiceLevel === 'very-hot',
      ingredients: item.ingredients ? JSON.parse(item.ingredients) : undefined,
      allergens: item.allergens ? JSON.parse(item.allergens) : undefined,
      nutritionalInfo: {
        calories: item.calories || undefined,
        protein: item.protein || undefined,
        carbs: item.carbs || undefined,
        fat: item.fat || undefined,
      }
    }));
    
    return NextResponse.json({ 
      success: true, 
      data: itemsWithParsedData 
    });
  } catch (error) {
    console.error('Menu API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch menu items' 
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdminAuth();
    const data = await req.json();
    const item = await prisma.menuItem.create({ data });
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }
    return NextResponse.json({ error: 'Failed to create menu item' }, { status: 500 });
  }
} 