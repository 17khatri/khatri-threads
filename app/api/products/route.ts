import { NextResponse } from "next/server";
import { Prisma, ProductStatus } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";

function toSlug(value: string) { return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""); }
async function requireAdmin() { const user = await getCurrentUser(); return user?.role === "ADMIN" ? null : NextResponse.json({ error: user ? "Forbidden" : "Unauthorized" }, { status: user ? 403 : 401 }); }
function productInput(body: Record<string, unknown>) {
  const name = String(body.name ?? "").trim(); const categoryId = String(body.categoryId ?? ""); const price = Number(body.price);
  const images = Array.isArray(body.images) ? body.images.map(String).map((url) => url.trim()).filter(Boolean) : [];
  if (!name || !categoryId || !Number.isFinite(price) || price < 0) throw new Error("Name, category, and a valid price are required.");
  const status = Object.values(ProductStatus).includes(body.status as ProductStatus) ? body.status as ProductStatus : ProductStatus.DRAFT;
  return { name, slug: toSlug(name), sku: String(body.sku ?? "").trim() || null, description: String(body.description ?? "").trim() || null, price: new Prisma.Decimal(price), categoryId, collectionId: String(body.collectionId ?? "") || null, status, isFeatured: Boolean(body.isFeatured), images: { create: images.map((url, sortOrder) => ({ url, sortOrder })) } };
}

export async function GET() { const error = await requireAdmin(); if (error) return error; return NextResponse.json(await prisma.product.findMany({ include: { category: true, collection: true, images: { orderBy: { sortOrder: "asc" } } }, orderBy: { updatedAt: "desc" } })); }
export async function POST(request: Request) {
  const error = await requireAdmin(); if (error) return error;
  try { return NextResponse.json(await prisma.product.create({ data: productInput(await request.json()), include: { category: true, collection: true, images: true } }), { status: 201 }); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to create product." }, { status: 400 }); }
}
