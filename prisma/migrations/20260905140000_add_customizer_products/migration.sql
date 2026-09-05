CREATE TABLE "Color" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hexCode" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Color_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CustomizerProduct" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "colorId" TEXT NOT NULL,
    "frontImageUrl" TEXT NOT NULL,
    "frontStoragePath" TEXT,
    "backImageUrl" TEXT NOT NULL,
    "backStoragePath" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomizerProduct_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Color_name_key" ON "Color"("name");
CREATE UNIQUE INDEX "CustomizerProduct_categoryId_colorId_key" ON "CustomizerProduct"("categoryId", "colorId");
CREATE INDEX "CustomizerProduct_categoryId_isActive_idx" ON "CustomizerProduct"("categoryId", "isActive");
CREATE INDEX "CustomizerProduct_colorId_isActive_idx" ON "CustomizerProduct"("colorId", "isActive");

ALTER TABLE "CustomizerProduct" ADD CONSTRAINT "CustomizerProduct_categoryId_fkey"
  FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CustomizerProduct" ADD CONSTRAINT "CustomizerProduct_colorId_fkey"
  FOREIGN KEY ("colorId") REFERENCES "Color"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
