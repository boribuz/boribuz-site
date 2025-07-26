import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminAuth } from '../../_lib/session';

// GET - Fetch all menu items and categories (public)
export async function GET() {
  try {
    const [menuItems, categories] = await Promise.all([
      prisma.menuItem.findMany({
        orderBy: { name: 'asc' }
      }),
      prisma.menuCategory.findMany({
        orderBy: { order: 'asc' }
      })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        menuItems: menuItems.map((item: {
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
        }) => ({
          id: item.itemId || item.id.toString(),
          name: item.name,
          description: item.description,
          price: item.price,
          category: item.category,
          image: item.image,
          imageUrl: item.imageUrl,
          available: item.available,
          featured: item.featured
        })),
        categories: categories.map((cat: { categoryId: string; name: string; description: string; order: number }) => ({
          id: cat.categoryId,
          name: cat.name,
          description: cat.description,
          order: cat.order
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching menu data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch menu data' },
      { status: 500 }
    );
  }
}

// POST - Create new menu item (admin only)
export async function POST(req: NextRequest) {
  try {
    await requireAdminAuth();

    const data = await req.json();
    
    if (data.type === 'menu-item') {
      // Validate required fields
      if (!data.name || !data.description || !data.price || !data.category) {
        return NextResponse.json(
          { success: false, error: 'Name, description, price, and category are required' },
          { status: 400 }
        );
      }

      // Generate itemId if not provided
      const itemId = data.itemId || `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const menuItem = await prisma.menuItem.create({
        data: {
          itemId: itemId,
          name: data.name,
          description: data.description,
          price: parseFloat(data.price),
          category: data.category,
          image: data.image || null,
          imageUrl: data.imageUrl || null,
          available: data.available !== false, // Default to true
          featured: data.featured || false
        }
      });

      return NextResponse.json({
        success: true,
        data: menuItem
      });
    } else if (data.type === 'category') {
      // Validate required fields for category
      if (!data.name) {
        return NextResponse.json(
          { success: false, error: 'Category name is required' },
          { status: 400 }
        );
      }

      // Generate categoryId if not provided
      const categoryId = data.categoryId || `cat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const category = await prisma.menuCategory.create({
        data: {
          categoryId: categoryId,
          name: data.name,
          description: data.description || '',
          order: data.order || 0
        }
      });

      return NextResponse.json({
        success: true,
        data: category
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid type specified' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error creating menu data:', error);
    
    if (error instanceof Response) {
      throw error;
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to create menu data' },
      { status: 500 }
    );
  }
}

// PUT - Update menu item or category (admin only)
export async function PUT(req: NextRequest) {
  try {
    await requireAdminAuth();

    const data = await req.json();
    
    if (data.type === 'menu-item') {
      // Validate required fields
      if (!data.name || !data.description || !data.price || !data.category) {
        return NextResponse.json(
          { success: false, error: 'Name, description, price, and category are required' },
          { status: 400 }
        );
      }

      const menuItem = await prisma.menuItem.update({
        where: { itemId: data.id },
        data: {
          name: data.name,
          description: data.description,
          price: parseFloat(data.price),
          category: data.category,
          image: data.image || null,
          imageUrl: data.imageUrl || null,
          available: data.available !== false,
          featured: data.featured || false
        }
      });

      return NextResponse.json({
        success: true,
        data: menuItem
      });
    } else if (data.type === 'category') {
      // Validate required fields for category
      if (!data.name) {
        return NextResponse.json(
          { success: false, error: 'Category name is required' },
          { status: 400 }
        );
      }

      const category = await prisma.menuCategory.update({
        where: { categoryId: data.id },
        data: {
          name: data.name,
          description: data.description || '',
          order: data.order || 0
        }
      });

      return NextResponse.json({
        success: true,
        data: category
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid type specified' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error updating menu data:', error);
    
    if (error instanceof Response) {
      throw error;
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to update menu data' },
      { status: 500 }
    );
  }
}

// DELETE - Delete menu item or category (admin only)
export async function DELETE(req: NextRequest) {
  try {
    await requireAdminAuth();

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (!type || !id) {
      return NextResponse.json(
        { success: false, error: 'Type and ID are required' },
        { status: 400 }
      );
    }
    
    if (type === 'menu-item') {
      await prisma.menuItem.delete({
        where: { itemId: id }
      });
    } else if (type === 'category') {
      await prisma.menuCategory.delete({
        where: { categoryId: id }
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid type specified' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `${type} deleted successfully`
    });
  } catch (error) {
    console.error('Error deleting menu data:', error);
    
    if (error instanceof Response) {
      throw error;
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to delete menu data' },
      { status: 500 }
    );
  }
}
