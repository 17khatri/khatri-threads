import { NextResponse } from "next/server";
import { ProductStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const featured = new URL(request.url).searchParams.get("featured") === "true";
  const products = await prisma.product.findMany({
    where: { status: ProductStatus.ACTIVE, ...(featured ? { isFeatured: true } : {}) },
    include: {
      category: true,
      categories: { include: { category: true }, orderBy: { createdAt: "asc" } },
      images: { orderBy: { sortOrder: "asc" } },
    },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json(products);
}
