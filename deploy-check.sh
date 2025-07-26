#!/bin/bash

echo "🚀 Preparing for deployment to Render.com..."

# Check if required files exist
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found"
    exit 1
fi

if [ ! -f "prisma/schema.prisma" ]; then
    echo "❌ Prisma schema not found"
    exit 1
fi

echo "✅ Essential files found"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🗄️ Generating Prisma client..."
npx prisma generate

# Build the application
echo "🔨 Building application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🎉 Ready for deployment!"
    echo ""
    echo "📋 Deployment checklist:"
    echo "1. Set environment variables on Render.com:"
    echo "   - DATABASE_URL (PostgreSQL URL for production)"
    echo "   - JWT_SECRET (use the one from .env or generate new)"
    echo "   - SMTP_* variables (your email settings from .env)"
    echo "   - NEXT_PUBLIC_APP_URL (your production domain)"
    echo "   - NEXTAUTH_URL (your production domain)"
    echo ""
    echo "2. Reference your .env file for the exact variable names and format"
    echo "   - Run 'npm install'"
    echo "   - Run 'npm run build'"
    echo "   - Start with 'npm start'"
    echo ""
    echo "3. After deployment, access /admin to manage your menu"
    echo "   Default admin: admin@boribuz.ca / Boribuz3254.2025"
    echo "   ⚠️ Change password immediately!"
else
    echo "❌ Build failed. Check for errors above."
    exit 1
fi
