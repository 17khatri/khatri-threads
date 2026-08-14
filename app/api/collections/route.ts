import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";

function toSlug(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

async function requireAdmin() {
  const user = await getCurrentUser();
  return user?.role === "ADMIN" ? null : NextResponse.json({ error: user ? "Forbidden" : "Unauthorized" }, { status: user ? 403 : 401 });
}

export async function GET() {
  const error = await requireAdmin();
  if (error) return error;
  return NextResponse.json(await prisma.collection.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }));
}

export async function POST(request: Request) {
  const error = await requireAdmin();
  if (error) return error;
  const body = await request.json();
  const name = String(body.name ?? "").trim();
  if (!name) return NextResponse.json({ error: "Collection name is required." }, { status: 400 });
  try {
    return NextResponse.json(await prisma.collection.create({ data: { name, slug: toSlug(name) } }), { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") return NextResponse.json({ error: "Collection already exists." }, { status: 400 });
    return NextResponse.json({ error: "Failed to create collection." }, { status: 500 });
  }
}
