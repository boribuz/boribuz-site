import nodemailer from 'nodemailer';

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: number;
  customerName: string;
  customerEmail: string | null;
  customerPhone: string;
  total: number;
  notes?: string | null;
  items: string; // JSON string of OrderItem[]
  status: string;
  createdAt: Date;
}

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOrderConfirmationEmail(
  customerEmail: string,
  customerName: string,
  order: Order
) {
  try {
    const orderItems = JSON.parse(order.items);
    const itemsList = orderItems
      .map((item: OrderItem) => `${item.quantity}x ${item.name || 'Item'} - $${item.price}`)
      .join('\n');

    const emailText = `
Dear ${customerName},

Thank you for your order! Here are the details:

Order #: ${order.id}
Date: ${new Date(order.createdAt).toLocaleString()}
Status: ${order.status}

Items:
${itemsList}

Total: $${orderItems.reduce((sum: number, item: OrderItem) => sum + (item.price * item.quantity), 0).toFixed(2)}

Customer Details:
Name: ${order.customerName}
Phone: ${order.customerPhone}
Email: ${order.customerEmail || 'Not provided'}

We'll contact you soon to confirm your order and provide pickup/delivery details.

Thank you for choosing Boribuz!

Best regards,
Boribuz Team
`;

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(to right, #f97316, #ea580c); color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; border: 1px solid #ddd; }
        .order-details { background: #f8f9fa; padding: 15px; margin: 15px 0; border-radius: 5px; }
        .items { margin: 15px 0; }
        .item { padding: 5px 0; border-bottom: 1px solid #eee; }
        .total { font-weight: bold; font-size: 18px; color: #f97316; }
        .footer { text-align: center; padding: 20px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Order Confirmation</h1>
            <p>Thank you for choosing Boribuz!</p>
        </div>
        
        <div class="content">
            <p>Dear ${customerName},</p>
            <p>Thank you for your order! Here are the details:</p>
            
            <div class="order-details">
                <h3>Order Information</h3>
                <p><strong>Order #:</strong> ${order.id}</p>
                <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
                <p><strong>Status:</strong> ${order.status}</p>
            </div>
            
            <div class="items">
                <h3>Order Items</h3>
                ${orderItems.map((item: OrderItem) => `
                    <div class="item">
                        ${item.quantity}x ${item.name || 'Item'} - $${item.price.toFixed(2)}
                    </div>
                `).join('')}
                <div class="total">
                    Total: $${orderItems.reduce((sum: number, item: OrderItem) => sum + (item.price * item.quantity), 0).toFixed(2)}
                </div>
            </div>
            
            <div class="order-details">
                <h3>Customer Details</h3>
                <p><strong>Name:</strong> ${order.customerName}</p>
                <p><strong>Phone:</strong> ${order.customerPhone}</p>
                <p><strong>Email:</strong> ${order.customerEmail || 'Not provided'}</p>
            </div>
            
            <p>We'll contact you soon to confirm your order and provide pickup/delivery details.</p>
        </div>
        
        <div class="footer">
            <p>&copy; 2024 Boribuz - Authentic Bangladeshi Cuisine</p>
            <p>If you have any questions, please contact us at orders@boribuz.ca</p>
        </div>
    </div>
</body>
</html>
`;

    await transporter.sendMail({
      from: `"Boribuz Restaurant" <${process.env.SMTP_USER}>`,
      to: customerEmail,
      subject: `Order Confirmation #${order.id} - Boribuz`,
      text: emailText,
      html: emailHtml,
    });

    console.log(`Order confirmation email sent to ${customerEmail}`);
    return true;
  } catch (error) {
    console.error('Failed to send order confirmation email:', error);
    return false;
  }
}

export async function sendVerificationEmail(email: string, name: string, code: string) {
  try {
    const emailText = `
Hello ${name},

Welcome to Boribuz! Please verify your email address to complete your registration.

Your verification code is: ${code}

This code will expire in 24 hours.

If you didn't create an account with us, please ignore this email.

Best regards,
Boribuz Team
`;

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(to right, #f97316, #ea580c); color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; border: 1px solid #ddd; }
        .code { background: #f8f9fa; padding: 20px; margin: 20px 0; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 2px; border-radius: 5px; color: #f97316; }
        .footer { text-align: center; padding: 20px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to Boribuz!</h1>
            <p>Authentic Bangladeshi Cuisine</p>
        </div>
        
        <div class="content">
            <p>Hello ${name},</p>
            <p>Welcome to Boribuz! Please verify your email address to complete your registration.</p>
            
            <div class="code">
                ${code}
            </div>
            
            <p>This code will expire in 24 hours.</p>
            <p>If you didn't create an account with us, please ignore this email.</p>
        </div>
        
        <div class="footer">
            <p>&copy; 2024 Boribuz - Authentic Bangladeshi Cuisine</p>
        </div>
    </div>
</body>
</html>
`;

    await transporter.sendMail({
      from: `"Boribuz Restaurant" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Verify Your Email - Boribuz',
      text: emailText,
      html: emailHtml,
    });

    console.log(`Verification email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Failed to send verification email:', error);
    return false;
  }
}

export async function sendAdminOrderNotification(order: Order) {
  try {
    const orderItems = JSON.parse(order.items);
    const itemsList = orderItems
      .map((item: OrderItem) => `${item.quantity}x ${item.name || 'Item'} - $${item.price}`)
      .join('\n');

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@boribuz.ca';

    const emailText = `
NEW ORDER RECEIVED

Order #: ${order.id}
Date: ${new Date(order.createdAt).toLocaleString()}
Status: ${order.status}

Customer Details:
Name: ${order.customerName}
Phone: ${order.customerPhone}
Email: ${order.customerEmail || 'Not provided'}

Items:
${itemsList}

Total: $${orderItems.reduce((sum: number, item: OrderItem) => sum + (item.price * item.quantity), 0).toFixed(2)}

Please process this order as soon as possible.
`;

    await transporter.sendMail({
      from: `"Boribuz System" <${process.env.SMTP_USER}>`,
      to: adminEmail,
      subject: `New Order #${order.id} - Boribuz`,
      text: emailText,
    });

    console.log(`Admin notification sent for order #${order.id}`);
    return true;
  } catch (error) {
    console.error('Failed to send admin notification:', error);
    return false;
  }
}

export async function sendPasswordResetEmail(email: string, name: string, resetToken: string) {
  try {
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    const emailText = `
Hello ${name},

You requested a password reset for your Boribuz account.

Click the link below to reset your password:
${resetUrl}

This link will expire in 1 hour for security reasons.

If you didn't request this password reset, please ignore this email. Your password will remain unchanged.

Best regards,
Boribuz Team
`;

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(to right, #f97316, #ea580c); color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; border: 1px solid #ddd; }
        .reset-button { 
            display: inline-block; 
            background: #f97316; 
            color: white; 
            padding: 15px 30px; 
            text-decoration: none; 
            border-radius: 5px; 
            margin: 20px 0;
            font-weight: bold;
        }
        .footer { text-align: center; padding: 20px; color: #666; }
        .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; margin: 15px 0; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Password Reset Request</h1>
            <p>Boribuz - Authentic Bangladeshi Cuisine</p>
        </div>
        
        <div class="content">
            <p>Hello ${name},</p>
            <p>You requested a password reset for your Boribuz account.</p>
            
            <div style="text-align: center;">
                <a href="${resetUrl}" class="reset-button">Reset Your Password</a>
            </div>
            
            <div class="warning">
                <p><strong>Security Notice:</strong></p>
                <p>• This link will expire in 1 hour for security reasons</p>
                <p>• If you didn't request this reset, please ignore this email</p>
                <p>• Your password will remain unchanged if you don't use this link</p>
            </div>
            
            <p>If the button above doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #666;">${resetUrl}</p>
        </div>
        
        <div class="footer">
            <p>&copy; 2024 Boribuz - Authentic Bangladeshi Cuisine</p>
            <p>If you have any questions, please contact us at support@boribuz.ca</p>
        </div>
    </div>
</body>
</html>
`;

    await transporter.sendMail({
      from: `"Boribuz Restaurant" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Password Reset Request - Boribuz',
      text: emailText,
      html: emailHtml,
    });

    console.log(`Password reset email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    return false;
  }
}
