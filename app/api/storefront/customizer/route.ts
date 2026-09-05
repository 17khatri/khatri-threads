import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const categoryId = new URL(request.url).searchParams.get("categoryId");
  if (!categoryId) {
    const categories = await prisma.category.findMany({
      where: { isActive: true, customizerProducts: { some: { isActive: true, color: { isActive: true } } } },
      select: { id: true, name: true, slug: true, description: true, imageUrl: true }, orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json({ categories }, { headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" } });
  }
  const category = await prisma.category.findFirst({ where: { id: categoryId, isActive: true }, select: { id: true, name: true, slug: true } });
  if (!category) return NextResponse.json({ error: "Category not found." }, { status: 404 });
  const products = await prisma.customizerProduct.findMany({ where: { categoryId, isActive: true, color: { isActive: true } }, include: { color: true }, orderBy: { color: { name: "asc" } } });
  return NextResponse.json({ category, products }, { headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" } });
}
