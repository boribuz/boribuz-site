import { prisma } from '@/lib/prisma';

type MenuItemType = {
  id: number;
  name: string;
  price: number;
  available: boolean;
};

interface OrderItem {
  id?: number;          // Legacy field
  menuItemId?: number;  // New field
  price: number;
  quantity: number;
  name?: string;
}

interface StoreHoursResult {
  isOpen: boolean;
  message?: string;
  openTime?: string;
  closeTime?: string;
}

interface MenuValidationResult {
  isValid: boolean;
  invalidItems?: string[];
  unavailableItems?: string[];
  message?: string;
}

/**
 * Check if the store is currently open based on store settings
 * Enhanced with closing time buffer and preparation time validation
 */
export async function checkStoreHours(): Promise<StoreHoursResult> {
  try {
    // Since we're using static content, we'll use hardcoded store hours
    const openTime = '10:00';
    const closeTime = '22:00';
    const timezone = 'America/Toronto';
    
    // Always assume store is open for now (you can add custom logic here)
    const storeOpen = true;

    // If store is manually closed
    if (!storeOpen) {
      return {
        isOpen: false,
        message: 'Store is currently closed. Please try again later.'
      };
    }

    // Check current time against store hours
    const now = new Date();
    const currentTime = now.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: timezone 
    });

    // Convert times to comparable format
    const currentMinutes = timeToMinutes(currentTime);
    const openMinutes = timeToMinutes(openTime);
    const closeMinutes = timeToMinutes(closeTime);

    // Add buffer time before closing (30 minutes default)
    const CLOSING_BUFFER_MINUTES = 30;
    const effectiveCloseMinutes = closeMinutes - CLOSING_BUFFER_MINUTES;

    let isOpen: boolean;
    let message: string | undefined;

    // Handle overnight hours (e.g., 22:00 to 02:00)
    if (closeMinutes < openMinutes) {
      // Overnight operation
      const isInOpenPeriod = currentMinutes >= openMinutes || currentMinutes <= effectiveCloseMinutes;
      const isInClosingBuffer = currentMinutes > effectiveCloseMinutes && currentMinutes <= closeMinutes;
      
      isOpen = isInOpenPeriod;
      
      if (isInClosingBuffer) {
        message = `Store stops accepting orders ${CLOSING_BUFFER_MINUTES} minutes before closing. Please place your order earlier.`;
      } else if (!isOpen) {
        message = `Store is closed. Hours: ${openTime} - ${closeTime}`;
      }
    } else {
      // Normal day operation
      const isInOpenPeriod = currentMinutes >= openMinutes && currentMinutes <= effectiveCloseMinutes;
      const isInClosingBuffer = currentMinutes > effectiveCloseMinutes && currentMinutes <= closeMinutes;
      
      isOpen = isInOpenPeriod;
      
      if (isInClosingBuffer) {
        message = `Store stops accepting orders ${CLOSING_BUFFER_MINUTES} minutes before closing. Please place your order earlier.`;
      } else if (!isOpen) {
        if (currentMinutes < openMinutes) {
          message = `Store is not open yet. Opens at ${openTime}`;
        } else {
          message = `Store is closed. Hours: ${openTime} - ${closeTime}`;
        }
      }
    }

    return {
      isOpen,
      message,
      openTime,
      closeTime
    };

  } catch (error) {
    console.error('Error checking store hours:', error);
    // Default to closed if there's an error for safety
    return { 
      isOpen: false, 
      message: 'Unable to verify store hours. Please try again later.' 
    };
  }
}

/**
 * Validate that all items in the order exist and are available
 */
export async function validateMenuItems(items: OrderItem[]): Promise<MenuValidationResult> {
  try {
    // Extract item IDs, supporting both id and menuItemId formats
    const itemIds = items.map(item => item.id || item.menuItemId).filter((id): id is number => id !== undefined);
    
    // Get all menu items that match the order
    const menuItems = await prisma.menuItem.findMany({
      where: {
        id: { in: itemIds }
      }
    });

    const invalidItems: string[] = [];
    const unavailableItems: string[] = [];

    // Check each ordered item
    for (const orderItem of items) {
      const itemId = orderItem.id || orderItem.menuItemId;
      const menuItem = menuItems.find((mi: MenuItemType) => mi.id === itemId);
      
      if (!menuItem) {
        // Item doesn't exist in menu
        invalidItems.push(orderItem.name || `Item ID ${itemId}`);
      } else if (!menuItem.available) {
        // Item exists but is not available
        unavailableItems.push(menuItem.name);
      } else if (Math.abs(menuItem.price - orderItem.price) > 0.01) {
        // Price mismatch (allowing for small floating point differences)
        invalidItems.push(`${menuItem.name} (price mismatch: expected $${menuItem.price}, got $${orderItem.price})`);
      }
    }

    if (invalidItems.length > 0 || unavailableItems.length > 0) {
      let message = '';
      if (invalidItems.length > 0) {
        message += `These items are no longer available: ${invalidItems.join(', ')}. `;
      }
      if (unavailableItems.length > 0) {
        message += `These items are currently unavailable: ${unavailableItems.join(', ')}. `;
      }
      message += 'Please refresh your cart and try again.';

      return {
        isValid: false,
        invalidItems,
        unavailableItems,
        message
      };
    }

    return { isValid: true };

  } catch (error) {
    console.error('Error validating menu items:', error);
    return {
      isValid: false,
      message: 'Unable to validate menu items. Please try again.'
    };
  }
}

/**
 * Convert time string (HH:MM) to minutes since midnight
 */
function timeToMinutes(timeString: string): number {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Validate order minimum and maximum limits
 */
export async function validateOrderLimits(items: OrderItem[]): Promise<{ isValid: boolean; message?: string }> {
  const MINIMUM_ORDER_AMOUNT = 15.00; // $15 minimum
  const MAXIMUM_ORDER_AMOUNT = 500.00; // $500 maximum
  const MAXIMUM_ITEM_QUANTITY = 20; // Max 20 of any single item
  const MAXIMUM_TOTAL_ITEMS = 50; // Max 50 total items

  // Calculate totals
  const orderTotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  // Check minimum order
  if (orderTotal < MINIMUM_ORDER_AMOUNT) {
    return {
      isValid: false,
      message: `Minimum order amount is $${MINIMUM_ORDER_AMOUNT.toFixed(2)}. Your order total is $${orderTotal.toFixed(2)}.`
    };
  }

  // Check maximum order
  if (orderTotal > MAXIMUM_ORDER_AMOUNT) {
    return {
      isValid: false,
      message: `Maximum order amount is $${MAXIMUM_ORDER_AMOUNT.toFixed(2)}. Please reduce your order or contact us directly for large orders.`
    };
  }

  // Check individual item quantities
  for (const item of items) {
    if (item.quantity > MAXIMUM_ITEM_QUANTITY) {
      return {
        isValid: false,
        message: `Maximum quantity per item is ${MAXIMUM_ITEM_QUANTITY}. Please reduce the quantity of "${item.name || 'this item'}".`
      };
    }
    if (item.quantity <= 0) {
      return {
        isValid: false,
        message: `Invalid quantity for "${item.name || 'an item'}". Quantity must be at least 1.`
      };
    }
  }

  // Check total items
  if (totalItems > MAXIMUM_TOTAL_ITEMS) {
    return {
      isValid: false,
      message: `Maximum total items per order is ${MAXIMUM_TOTAL_ITEMS}. Please reduce your order size.`
    };
  }

  return { isValid: true };
}

/**
 * Validate customer information format and requirements
 */
export function validateCustomerInfo(customerName: string, customerPhone: string, customerEmail?: string): { isValid: boolean; message?: string } {
  // Name validation
  if (!customerName || customerName.trim().length < 2) {
    return {
      isValid: false,
      message: 'Customer name must be at least 2 characters long.'
    };
  }

  if (customerName.length > 50) {
    return {
      isValid: false,
      message: 'Customer name must be less than 50 characters.'
    };
  }

  // Phone validation
  const phoneRegex = /^[\+]?[(]?[\d\s\-\(\)]{10,15}$/;
  if (!customerPhone || !phoneRegex.test(customerPhone.replace(/\s/g, ''))) {
    return {
      isValid: false,
      message: 'Please provide a valid phone number (10-15 digits).'
    };
  }

  // Email validation (if provided)
  if (customerEmail) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      return {
        isValid: false,
        message: 'Please provide a valid email address.'
      };
    }
  }

  return { isValid: true };
}

/**
 * Check for duplicate recent orders to prevent accidental resubmission
 */
export async function checkDuplicateOrder(customerPhone: string, items: OrderItem[]): Promise<{ isDuplicate: boolean; message?: string }> {
  try {
    const DUPLICATE_CHECK_MINUTES = 5; // Check for duplicates within 5 minutes
    const cutoffTime = new Date(Date.now() - DUPLICATE_CHECK_MINUTES * 60 * 1000);

    // Find recent orders from the same phone number
    const recentOrders = await prisma.order.findMany({
      where: {
        customerPhone,
        createdAt: {
          gte: cutoffTime
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5
    });

    // Check if any recent order has the same items
    const currentOrderSignature = createOrderSignature(items);
    
    for (const order of recentOrders) {
      try {
        if (typeof order.items === 'string') {
          const orderItems = JSON.parse(order.items) as OrderItem[];
          const orderSignature = createOrderSignature(orderItems);
          
          if (orderSignature === currentOrderSignature) {
            return {
              isDuplicate: true,
              message: 'This appears to be a duplicate order. Please wait a few minutes before placing the same order again.'
            };
          }
        }
      } catch {
        // Skip malformed order data
        continue;
      }
    }

    return { isDuplicate: false };

  } catch (error) {
    console.error('Error checking for duplicate orders:', error);
    // Don't block orders if duplicate check fails
    return { isDuplicate: false };
  }
}

/**
 * Create a signature for an order based on items and quantities
 */
function createOrderSignature(items: OrderItem[]): string {
  return items
    .map(item => `${item.id || item.menuItemId}:${item.quantity}`)
    .sort()
    .join('|');
}

/**
 * Rate limiting for orders per customer
 */
export async function checkOrderRateLimit(customerPhone: string): Promise<{ isAllowed: boolean; message?: string }> {
  try {
    const RATE_LIMIT_MINUTES = 60; // 1 hour window
    const MAX_ORDERS_PER_HOUR = 3; // Max 3 orders per hour per phone number
    
    const cutoffTime = new Date(Date.now() - RATE_LIMIT_MINUTES * 60 * 1000);

    const recentOrderCount = await prisma.order.count({
      where: {
        customerPhone,
        createdAt: {
          gte: cutoffTime
        }
      }
    });

    if (recentOrderCount >= MAX_ORDERS_PER_HOUR) {
      return {
        isAllowed: false,
        message: `You have reached the maximum of ${MAX_ORDERS_PER_HOUR} orders per hour. Please wait before placing another order.`
      };
    }

    return { isAllowed: true };

  } catch (error) {
    console.error('Error checking order rate limit:', error);
    // Don't block orders if rate limit check fails
    return { isAllowed: true };
  }
}

/**
 * Check if the store has sufficient preparation capacity
 */
export async function checkStoreCapacity(): Promise<{ hasCapacity: boolean; message?: string }> {
  try {
    const CAPACITY_CHECK_MINUTES = 30; // Check orders in last 30 minutes
    const MAX_CONCURRENT_ORDERS = 20; // Max orders being prepared at once
    
    const cutoffTime = new Date(Date.now() - CAPACITY_CHECK_MINUTES * 60 * 1000);

    // Count orders that are being prepared (pending, confirmed, preparing)
    const activeOrderCount = await prisma.order.count({
      where: {
        status: {
          in: ['pending', 'confirmed', 'preparing']
        },
        createdAt: {
          gte: cutoffTime
        }
      }
    });

    if (activeOrderCount >= MAX_CONCURRENT_ORDERS) {
      return {
        hasCapacity: false,
        message: 'We are currently experiencing high order volume. Please try again in 15-20 minutes for faster service.'
      };
    }

    return { hasCapacity: true };

  } catch (error) {
    console.error('Error checking store capacity:', error);
    // Allow orders if capacity check fails
    return { hasCapacity: true };
  }
}
