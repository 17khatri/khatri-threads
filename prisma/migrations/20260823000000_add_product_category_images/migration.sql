-- Allow a single product design to appear in one or more categories.
CREATE TABLE "ProductCategory" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductCategory_pkey" PRIMARY KEY ("id")
);

-- Keep existing product data valid: its previous category becomes its default.
INSERT INTO "ProductCategory" ("id", "productId", "categoryId", "isDefault", "createdAt", "updatedAt")
SELECT
    'legacy_' || "id",
    "id",
    "categoryId",
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM "Product";

ALTER TABLE "ProductImage" ADD COLUMN "categoryId" TEXT;
ALTER TABLE "ProductImage" ADD COLUMN "storagePath" TEXT;

-- Existing gallery images belong to the product's former (now default) category.
UPDATE "ProductImage" AS image
SET "categoryId" = product."categoryId"
FROM "Product" AS product
WHERE image."productId" = product."id";

ALTER TABLE "ProductImage" ALTER COLUMN "categoryId" SET NOT NULL;

CREATE UNIQUE INDEX "ProductCategory_productId_categoryId_key" ON "ProductCategory"("productId", "categoryId");
CREATE INDEX "ProductCategory_categoryId_idx" ON "ProductCategory"("categoryId");
CREATE INDEX "ProductCategory_productId_isDefault_idx" ON "ProductCategory"("productId", "isDefault");
CREATE UNIQUE INDEX "ProductImage_storagePath_key" ON "ProductImage"("storagePath");
CREATE INDEX "ProductImage_productId_categoryId_sortOrder_idx" ON "ProductImage"("productId", "categoryId", "sortOrder");

ALTER TABLE "ProductCategory" ADD CONSTRAINT "ProductCategory_productId_fkey"
  FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProductCategory" ADD CONSTRAINT "ProductCategory_categoryId_fkey"
  FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_categoryId_fkey"
  FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
