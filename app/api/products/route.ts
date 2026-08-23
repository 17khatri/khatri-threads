import { NextResponse } from "next/server";
import { Prisma, ProductStatus } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";

type ImageInput = { categoryId: string; url: string; storagePath?: string | null; altText?: string | null };

function toSlug(value: string) { return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""); }
async function requireAdmin() { const user = await getCurrentUser(); return user?.role === "ADMIN" ? null : NextResponse.json({ error: user ? "Forbidden" : "Unauthorized" }, { status: user ? 403 : 401 }); }

function productInput(body: Record<string, unknown>) {
  const name = String(body.name ?? "").trim();
  const price = Number(body.price);
  const categoryIds = [...new Set(Array.isArray(body.categoryIds) ? body.categoryIds.map(String).filter(Boolean) : [])];
  const defaultCategoryId = String(body.defaultCategoryId ?? "");
  const images = (Array.isArray(body.images) ? body.images : []) as ImageInput[];
  if (!name || !Number.isFinite(price) || price < 0 || !categoryIds.length) throw new Error("Name, at least one category, and a valid price are required.");
  if (!categoryIds.includes(defaultCategoryId)) throw new Error("Choose one selected category as the default.");
  if (images.some((image) => !categoryIds.includes(String(image.categoryId)) || !image.url) || categoryIds.some((categoryId) => !images.some((image) => image.categoryId === categoryId))) throw new Error("Upload at least one image for every selected category.");
  const status = Object.values(ProductStatus).includes(body.status as ProductStatus) ? body.status as ProductStatus : ProductStatus.DRAFT;
  return {
    name, slug: toSlug(name), sku: String(body.sku ?? "").trim() || null, description: String(body.description ?? "").trim() || null, price: new Prisma.Decimal(price), categoryId: defaultCategoryId, collectionId: String(body.collectionId ?? "") || null, status, isFeatured: Boolean(body.isFeatured),
    categories: { create: categoryIds.map((categoryId) => ({ categoryId, isDefault: categoryId === defaultCategoryId })) },
    images: { create: images.map((image, sortOrder) => ({ categoryId: image.categoryId, url: image.url, storagePath: image.storagePath || null, altText: image.altText || null, sortOrder })) },
  };
}

const productInclude = { category: true, collection: true, categories: { include: { category: true }, orderBy: { createdAt: "asc" as const } }, images: { orderBy: { sortOrder: "asc" as const } } };

export async function GET() { const error = await requireAdmin(); if (error) return error; return NextResponse.json(await prisma.product.findMany({ include: productInclude, orderBy: { updatedAt: "desc" } })); }
export async function POST(request: Request) { const error = await requireAdmin(); if (error) return error; try { return NextResponse.json(await prisma.product.create({ data: productInput(await request.json()), include: productInclude }), { status: 201 }); } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to create product." }, { status: 400 }); } }
