/**
 * Clover POS Integration Service
 * Handles sending orders to Clover POS system
 */

interface CloverOrderItem {
  name: string;
  price: number; // Price in cents
  quantity: number;
}

interface CloverOrder {
  items: CloverOrderItem[];
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  notes?: string;
  total: number; // Total in cents
}

interface CloverLineItem {
  item: {
    name: string;
    price: number; // Price in cents
  };
  unitQty: number;
}

interface CloverOrderPayload {
  state: string;
  note?: string;
  lineItems: CloverLineItem[];
  currency: string;
}

interface CloverApiResponse {
  success: boolean;
  message?: string;
  data?: unknown;
  error?: unknown;
  cloverOrderId?: string;
  cloverOrder?: unknown;
}

class CloverService {
  private baseUrl: string;
  private merchantId: string;
  private accessToken: string;
  private appId: string;

  constructor() {
    this.baseUrl = process.env.CLOVER_API_URL || 'https://api.clover.com';
    this.merchantId = process.env.CLOVER_MERCHANT_ID || '';
    this.accessToken = process.env.CLOVER_ACCESS_TOKEN || '';
    this.appId = process.env.CLOVER_APP_ID || '';

    if (!this.merchantId || !this.accessToken) {
      console.warn('Clover credentials not configured. Orders will not be sent to Clover.');
    }
  }

  /**
   * Check if Clover integration is properly configured
   */
  isConfigured(): boolean {
    return !!(this.merchantId && this.accessToken);
  }

  /**
   * Convert dollar amount to cents for Clover API
   */
  private dollarsToCents(dollars: number): number {
    return Math.round(dollars * 100);
  }

  /**
   * Send order to Clover POS system
   */
  async sendOrderToClover(orderData: CloverOrder): Promise<CloverApiResponse> {
    if (!this.isConfigured()) {
      console.log('Clover not configured - skipping order sync');
      return { success: false, message: 'Clover not configured' };
    }

    try {
      // Prepare line items for Clover
      const lineItems: CloverLineItem[] = orderData.items.map(item => ({
        item: {
          name: item.name,
          price: this.dollarsToCents(item.price)
        },
        unitQty: item.quantity
      }));

      // Prepare order payload
      const orderPayload: CloverOrderPayload = {
        state: 'open', // Order state: 'open', 'locked', 'paid'
        note: this.buildOrderNote(orderData),
        lineItems,
        currency: 'USD' // or 'CAD' for Canadian dollars
      };

      // Send to Clover API
      const response = await fetch(`${this.baseUrl}/v3/merchants/${this.merchantId}/orders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
          'X-Clover-App-Id': this.appId
        },
        body: JSON.stringify(orderPayload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Clover API error: ${response.status} - ${errorText}`);
      }

      const cloverOrder = await response.json();
      console.log('Order successfully sent to Clover:', cloverOrder.id);

      return {
        success: true,
        cloverOrderId: cloverOrder.id,
        cloverOrder
      };

    } catch (error) {
      console.error('Failed to send order to Clover:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Build order note with customer information
   */
  private buildOrderNote(orderData: CloverOrder): string {
    let note = `Customer: ${orderData.customerName}\n`;
    note += `Phone: ${orderData.customerPhone}\n`;
    
    if (orderData.customerEmail) {
      note += `Email: ${orderData.customerEmail}\n`;
    }
    
    if (orderData.notes) {
      note += `\nOrder Notes: ${orderData.notes}`;
    }
    
    note += `\n\nTotal: $${(orderData.total / 100).toFixed(2)}`;
    
    return note;
  }

  /**
   * Update order status in Clover (e.g., when order is completed)
   */
  async updateOrderStatus(cloverOrderId: string, state: 'open' | 'locked' | 'paid'): Promise<CloverApiResponse> {
    if (!this.isConfigured()) {
      return { success: false, message: 'Clover not configured' };
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/v3/merchants/${this.merchantId}/orders/${cloverOrderId}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
            'X-Clover-App-Id': this.appId
          },
          body: JSON.stringify({ state })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Clover API error: ${response.status} - ${errorText}`);
      }

      const updatedOrder = await response.json();
      return { success: true, cloverOrder: updatedOrder };

    } catch (error) {
      console.error('Failed to update Clover order:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get order from Clover by ID
   */
  async getCloverOrder(cloverOrderId: string): Promise<CloverApiResponse> {
    if (!this.isConfigured()) {
      return { success: false, message: 'Clover not configured' };
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/v3/merchants/${this.merchantId}/orders/${cloverOrderId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'X-Clover-App-Id': this.appId
          }
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Clover API error: ${response.status} - ${errorText}`);
      }

      const cloverOrder = await response.json();
      return { success: true, cloverOrder };

    } catch (error) {
      console.error('Failed to get Clover order:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

// Export singleton instance
export const cloverService = new CloverService();

// Export types for use in other files
export type { CloverOrder, CloverOrderItem };
