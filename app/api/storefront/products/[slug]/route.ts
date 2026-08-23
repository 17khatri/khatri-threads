import { NextResponse } from "next/server";
import { ProductStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.product.findFirst({
    where: { slug, status: ProductStatus.ACTIVE },
    include: {
      category: true,
      collection: true,
      categories: { include: { category: true }, orderBy: { createdAt: "asc" } },
      images: { orderBy: { sortOrder: "asc" } },
    },
  });
  if (!product) return NextResponse.json({ error: "Product not found." }, { status: 404 });
  return NextResponse.json(product);
}
