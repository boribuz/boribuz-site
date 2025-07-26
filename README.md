# Boribuz Restaurant Website

A modern, responsive restaurant website built with Next.js 15, TypeScript, and Tailwind CSS. Features a clean admin panel for menu management and a beautiful customer-facing interface.

## Features

- **Customer Features:**
  - Browse restaurant menu with categories
  - View detailed item descriptions, prices, and images
  - Responsive design for all devices
  - Fast loading and optimized performance

- **Admin Features:**
  - Secure admin login
  - Menu item management (add, edit, delete)
  - Category management
  - Image URL support for menu items
  - Real-time updates reflected globally

## Tech Stack

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, Prisma ORM
- **Database:** SQLite (development) / PostgreSQL (production)
- **Authentication:** JWT-based auth with bcrypt password hashing
- **Email:** Nodemailer with Gmail SMTP support

## Environment Variables

The repository includes a `.env` file with working configuration. For production deployment, update these values:

```env
# Database (use PostgreSQL URL for production)
DATABASE_URL="your_production_database_url"

# Email Configuration (already configured for Boribuz)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=info.boribuz@gmail.com
SMTP_PASS=your_gmail_app_password

# Admin email for order notifications
ADMIN_EMAIL=info.boribuz@gmail.com
ADMIN_NAME=Boribuz Restaurant

# JWT Secret (already set, change if needed)
JWT_SECRET=your-secure-jwt-secret-key

# Next.js App URL (update for production)
NEXTAUTH_URL=https://your-domain.com
```

## Quick Start

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up database:**
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

3. **Build and start:**
   ```bash
   npm run build
   npm start
   ```

The application will be available at `http://localhost:3000`

## Admin Access

Default admin credentials (created during seeding):
- **Email:** `admin@boribuz.ca`
- **Password:** `Boribuz3254.2025`

**⚠️ Important:** Change the admin password immediately after first login!

## Deployment

This application is optimized for deployment on platforms like Render.com, Vercel, or Railway:

1. Set up environment variables on your platform
2. Configure your database URL
3. The build process will automatically run migrations
4. Access `/admin` to manage your menu

## License

Private project - All rights reserved.
