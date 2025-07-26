-- CreateTable
CREATE TABLE "RestaurantInfo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL DEFAULT 'Boribuz',
    "tagline" TEXT NOT NULL DEFAULT 'Authentic Bengali Cuisine',
    "description" TEXT NOT NULL DEFAULT 'Experience the rich flavors of traditional Bengali cuisine with our authentic recipes passed down through generations.',
    "addressStreet" TEXT NOT NULL DEFAULT '123 Main Street',
    "addressCity" TEXT NOT NULL DEFAULT 'New York',
    "addressState" TEXT NOT NULL DEFAULT 'NY',
    "addressZip" TEXT NOT NULL DEFAULT '10001',
    "addressCountry" TEXT NOT NULL DEFAULT 'USA',
    "contactPhone" TEXT NOT NULL DEFAULT '(555) 123-4567',
    "contactEmail" TEXT NOT NULL DEFAULT 'info@boribuz.com',
    "contactWebsite" TEXT NOT NULL DEFAULT 'www.boribuz.com',
    "orderingUberEats" TEXT NOT NULL DEFAULT '',
    "orderingSkipDishes" TEXT NOT NULL DEFAULT '',
    "footerDescription" TEXT NOT NULL DEFAULT 'Authentic Bengali restaurant serving traditional flavors with modern flair. Experience the taste of Bengal in every bite.',
    "footerCopyright" TEXT NOT NULL DEFAULT '© 2024 Boribuz. All rights reserved.',
    "socialFacebook" TEXT NOT NULL DEFAULT '',
    "socialInstagram" TEXT NOT NULL DEFAULT '',
    "socialTwitter" TEXT NOT NULL DEFAULT '',
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
