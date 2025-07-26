/*
  Warnings:

  - You are about to drop the `ContentSection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ImageSection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RestaurantInfo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SiteSettings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "ContentSection_sectionId_key";

-- DropIndex
DROP INDEX "ImageSection_sectionId_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ContentSection";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ImageSection";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "RestaurantInfo";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "SiteSettings";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MenuItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "itemId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "image" TEXT,
    "imageUrl" TEXT,
    "category" TEXT NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "ingredients" TEXT,
    "allergens" TEXT,
    "calories" INTEGER,
    "protein" REAL,
    "carbs" REAL,
    "fat" REAL,
    "preparationTime" TEXT,
    "spiceLevel" TEXT,
    "isVegetarian" BOOLEAN NOT NULL DEFAULT false,
    "isVegan" BOOLEAN NOT NULL DEFAULT false,
    "isGlutenFree" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_MenuItem" ("allergens", "available", "calories", "carbs", "category", "createdAt", "description", "fat", "featured", "id", "image", "ingredients", "isGlutenFree", "isVegan", "isVegetarian", "itemId", "name", "preparationTime", "price", "protein", "spiceLevel", "updatedAt") SELECT "allergens", "available", "calories", "carbs", "category", "createdAt", "description", "fat", "featured", "id", "image", "ingredients", "isGlutenFree", "isVegan", "isVegetarian", "itemId", "name", "preparationTime", "price", "protein", "spiceLevel", "updatedAt" FROM "MenuItem";
DROP TABLE "MenuItem";
ALTER TABLE "new_MenuItem" RENAME TO "MenuItem";
CREATE UNIQUE INDEX "MenuItem_itemId_key" ON "MenuItem"("itemId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
