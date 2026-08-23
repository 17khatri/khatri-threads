import { NextResponse } from "next/server";
import { Prisma, ProductStatus } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth/auth";
import { removeProductImages } from "@/lib/product-images";
import { prisma } from "@/lib/prisma";

type ImageInput = { categoryId: string; url: string; storagePath?: string | null; altText?: string | null };
function toSlug(value: string) { return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""); }
async function requireAdmin() { const user = await getCurrentUser(); return user?.role === "ADMIN" ? null : NextResponse.json({ error: user ? "Forbidden" : "Unauthorized" }, { status: user ? 403 : 401 }); }
function input(body: Record<string, unknown>) {
  const name = String(body.name ?? "").trim(); const price = Number(body.price); const categoryIds = [...new Set(Array.isArray(body.categoryIds) ? body.categoryIds.map(String).filter(Boolean) : [])]; const defaultCategoryId = String(body.defaultCategoryId ?? ""); const images = (Array.isArray(body.images) ? body.images : []) as ImageInput[];
  if (!name || !Number.isFinite(price) || price < 0 || !categoryIds.length) throw new Error("Name, at least one category, and a valid price are required.");
  if (!categoryIds.includes(defaultCategoryId)) throw new Error("Choose one selected category as the default.");
  if (images.some((image) => !categoryIds.includes(String(image.categoryId)) || !image.url) || categoryIds.some((categoryId) => !images.some((image) => image.categoryId === categoryId))) throw new Error("Upload at least one image for every selected category.");
  return { name, slug: toSlug(name), sku: String(body.sku ?? "").trim() || null, description: String(body.description ?? "").trim() || null, price: new Prisma.Decimal(price), collectionId: String(body.collectionId ?? "") || null, status: Object.values(ProductStatus).includes(body.status as ProductStatus) ? body.status as ProductStatus : ProductStatus.DRAFT, isFeatured: Boolean(body.isFeatured), categoryIds, defaultCategoryId, images };
}
const include = { category: true, collection: true, categories: { include: { category: true } }, images: { orderBy: { sortOrder: "asc" as const } } };
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const error = await requireAdmin(); if (error) return error;
  try {
    const { id } = await params; const data = input(await request.json()); const existing = await prisma.product.findUnique({ where: { id }, include: { images: true } }); if (!existing) return NextResponse.json({ error: "Product not found." }, { status: 404 });
    const result = await prisma.product.update({ where: { id }, data: { name: data.name, slug: data.slug, sku: data.sku, description: data.description, price: data.price, categoryId: data.defaultCategoryId, collectionId: data.collectionId, status: data.status, isFeatured: data.isFeatured, categories: { deleteMany: {}, create: data.categoryIds.map((categoryId) => ({ categoryId, isDefault: categoryId === data.defaultCategoryId })) }, images: { deleteMany: {}, create: data.images.map((image, sortOrder) => ({ categoryId: image.categoryId, url: image.url, storagePath: image.storagePath || null, altText: image.altText || null, sortOrder })) } }, include });
    const retained = new Set(data.images.map((image) => image.storagePath).filter(Boolean));
    await removeProductImages(existing.images.map((image) => image.storagePath).filter((path): path is string => Boolean(path) && !retained.has(path)));
    return NextResponse.json(result);
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to update product." }, { status: 400 }); }
}
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) { const error = await requireAdmin(); if (error) return error; const { id } = await params; const product = await prisma.product.findUnique({ where: { id }, include: { images: true } }); if (!product) return NextResponse.json({ error: "Product not found." }, { status: 404 }); await prisma.product.delete({ where: { id } }); await removeProductImages(product.images.map((image) => image.storagePath).filter((path): path is string => Boolean(path))); return NextResponse.json({ success: true }); }
