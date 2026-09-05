import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() { const user = await getCurrentUser(); return user?.role === "ADMIN" ? null : NextResponse.json({ error: user ? "Forbidden" : "Unauthorized" }, { status: user ? 403 : 401 }); }
function input(body: Record<string, unknown>) {
  const categoryId = String(body.categoryId ?? ""); const colorId = String(body.colorId ?? "");
  const frontImageUrl = String(body.frontImageUrl ?? ""); const backImageUrl = String(body.backImageUrl ?? "");
  if (!categoryId || !colorId || !frontImageUrl || !backImageUrl) throw new Error("Category, color, front image, and back image are required.");
  return { categoryId, colorId, frontImageUrl, backImageUrl, frontStoragePath: String(body.frontStoragePath ?? "") || null, backStoragePath: String(body.backStoragePath ?? "") || null, isActive: Boolean(body.isActive) };
}
const include = { category: true, color: true };
export async function GET() { const error = await requireAdmin(); if (error) return error; return NextResponse.json(await prisma.customizerProduct.findMany({ include, orderBy: [{ category: { name: "asc" } }, { color: { name: "asc" } }] })); }
export async function POST(request: Request) { const error = await requireAdmin(); if (error) return error; try { return NextResponse.json(await prisma.customizerProduct.create({ data: input(await request.json()), include }), { status: 201 }); } catch (error) { if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") return NextResponse.json({ error: "This category and color combination already exists." }, { status: 400 }); return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to save customizer product." }, { status: 400 }); } }
