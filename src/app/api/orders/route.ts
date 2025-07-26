import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireAdminAuth } from '../_lib/session';
import { getUserSessionId } from '../_lib/userSession';
import { 
  checkStoreHours, 
  validateMenuItems, 
  validateOrderLimits, 
  validateCustomerInfo, 
  checkDuplicateOrder, 
  checkOrderRateLimit, 
  checkStoreCapacity 
} from '../_lib/orderValidation';
import { sendOrderConfirmationEmail, sendAdminOrderNotification } from '../_lib/emailService';
import { cloverService } from '../_lib/cloverService';
import type { CloverOrder } from '../_lib/cloverService';

const prisma = new PrismaClient();

interface OrderItem {
  id: number;
  price: number;
  quantity: number;
  name?: string;
}

export async function GET() {
  try {
    await requireAdminAuth();
    const orders = await prisma.order.findMany({ 
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' } 
    });
    return NextResponse.json(orders);
    return NextResponse.json(orders);
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { items, customerName, customerPhone, customerEmail, notes }: {
      items: OrderItem[];
      customerName: string;
      customerPhone: string;
      customerEmail?: string;
      notes?: string;
    } = await req.json();
    
    // Basic input validation
    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in order' }, { status: 400 });
    }

    if (!customerName || !customerPhone) {
      return NextResponse.json({ error: 'Customer name and phone are required' }, { status: 400 });
    }

    // Validate customer information format
    const customerValidation = validateCustomerInfo(customerName, customerPhone, customerEmail);
    if (!customerValidation.isValid) {
      return NextResponse.json({ error: customerValidation.message }, { status: 400 });
    }

    // Check store hours with closing buffer
    const storeStatus = await checkStoreHours();
    if (!storeStatus.isOpen) {
      return NextResponse.json({ 
        error: storeStatus.message,
        storeHours: {
          openTime: storeStatus.openTime,
          closeTime: storeStatus.closeTime
        }
      }, { status: 400 });
    }

    // Check order limits (minimum/maximum amounts, quantities)
    const limitsValidation = await validateOrderLimits(items);
    if (!limitsValidation.isValid) {
      return NextResponse.json({ error: limitsValidation.message }, { status: 400 });
    }

    // Validate menu items (existence, availability, pricing)
    const menuValidation = await validateMenuItems(items);
    if (!menuValidation.isValid) {
      return NextResponse.json({ 
        error: menuValidation.message,
        invalidItems: menuValidation.invalidItems,
        unavailableItems: menuValidation.unavailableItems
      }, { status: 400 });
    }

    // Check for duplicate orders
    const duplicateCheck = await checkDuplicateOrder(customerPhone, items);
    if (duplicateCheck.isDuplicate) {
      return NextResponse.json({ error: duplicateCheck.message }, { status: 429 });
    }

    // Check order rate limiting
    const rateLimitCheck = await checkOrderRateLimit(customerPhone);
    if (!rateLimitCheck.isAllowed) {
      return NextResponse.json({ error: rateLimitCheck.message }, { status: 429 });
    }

    // Check store capacity
    const capacityCheck = await checkStoreCapacity();
    if (!capacityCheck.hasCapacity) {
      return NextResponse.json({ error: capacityCheck.message }, { status: 503 });
    }

    // Check if user is authenticated (for linking orders)
    const userId = await getUserSessionId();

    // If user is logged in, verify their email is verified
    if (userId) {
      const user = await prisma.user.findUnique({ 
        where: { id: userId },
        select: { emailVerified: true, email: true, name: true }
      });
      
      if (user && !user.emailVerified) {
        // Skip verification check for admin users
        const isAdmin = user.email.endsWith('@admin.boribuz.ca') || 
                       user.email === 'admin@boribuz.ca' ||
                       user.email === 'sakib@boribuz.ca';
        
        if (!isAdmin) {
          return NextResponse.json({ 
            error: 'Please verify your email address before placing an order',
            needsVerification: true,
            email: user.email
          }, { status: 403 });
        }
      }
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: userId || undefined, // Link to user if authenticated
        customerName,
        customerPhone,
        customerEmail: customerEmail || null,
        notes: notes || null,
        items: JSON.stringify(items), // Store items as JSON
        status: 'pending',
      },
    });

    // Calculate total for Clover
    const orderTotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);

    // Send order to Clover POS (don't block order creation if Clover fails)
    let cloverResult = null;
    try {
      const cloverOrderData: CloverOrder = {
        items: items.map(item => ({
          name: item.name || `Item ${item.id}`,
          price: item.price,
          quantity: item.quantity
        })),
        customerName,
        customerPhone,
        customerEmail,
        notes,
        total: Math.round(orderTotal * 100) // Convert to cents
      };

      cloverResult = await cloverService.sendOrderToClover(cloverOrderData);
      
      if (cloverResult.success) {
        console.log(`Order #${order.id} sent to Clover successfully. Clover Order ID: ${cloverResult.cloverOrderId}`);
        
        // Optionally, you could update the order with the Clover order ID
        // await prisma.order.update({
        //   where: { id: order.id },
        //   data: { cloverOrderId: cloverResult.cloverOrderId }
        // });
      } else {
        console.error(`Failed to send order #${order.id} to Clover:`, cloverResult.error);
      }
    } catch (cloverError) {
      console.error('Clover integration failed:', cloverError);
      // Continue - order was created successfully in our system
    }

    // Send email notifications (don't block order creation if emails fail)
    try {
      // Add total to order object for email functions
      const orderWithTotal = { 
        ...order, 
        total: orderTotal,
        items: order.items as string // Cast JsonValue to string for email functions
      };
      
      if (customerEmail) {
        await sendOrderConfirmationEmail(customerEmail, customerName, orderWithTotal);
      }
      await sendAdminOrderNotification(orderWithTotal);
    } catch (emailError) {
      console.error('Email notification failed:', emailError);
      // Continue - order was created successfully
    }

    // Return order with Clover integration status
    const response = {
      ...order,
      clover: cloverResult ? {
        success: cloverResult.success,
        cloverOrderId: cloverResult.cloverOrderId || null,
        error: cloverResult.error || null
      } : null
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

// TODO: Implement email notifications
// async function sendOrderEmail(to: string, order: any) {
//   const transporter = nodemailer.createTransporter({ /* SMTP config */ });
//   await transporter.sendMail({
//     from: 'no-reply@boribuz.ca',
//     to,
//     subject: 'New Order Received',
//     text: JSON.stringify(order, null, 2),
//   });
// }
