import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";

function toSlug(value: string) { return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""); }
async function requireAdmin() { const user = await getCurrentUser(); return user?.role === "ADMIN" ? null : NextResponse.json({ error: user ? "Forbidden" : "Unauthorized" }, { status: user ? 403 : 401 }); }

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const error = await requireAdmin(); if (error) return error;
  const { id } = await params; const name = String((await request.json()).name ?? "").trim();
  if (!name) return NextResponse.json({ error: "Collection name is required." }, { status: 400 });
  try { return NextResponse.json(await prisma.collection.update({ where: { id }, data: { name, slug: toSlug(name) } })); }
  catch (error) { return NextResponse.json({ error: error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002" ? "Collection already exists." : "Failed to update collection." }, { status: 400 }); }
}
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const error = await requireAdmin(); if (error) return error;
  try { const { id } = await params; await prisma.collection.delete({ where: { id } }); return NextResponse.json({ success: true }); }
  catch { return NextResponse.json({ error: "A collection used by a product cannot be deleted." }, { status: 400 }); }
}
