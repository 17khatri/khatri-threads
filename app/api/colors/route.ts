import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const user = await getCurrentUser();
  return user?.role === "ADMIN"
    ? null
    : NextResponse.json({ error: user ? "Forbidden" : "Unauthorized" }, { status: user ? 403 : 401 });
}

function input(body: Record<string, unknown>) {
  const name = String(body.name ?? "").trim();
  const hexCode = String(body.hexCode ?? "").trim().toUpperCase();
  if (!name) throw new Error("Color name is required.");
  if (!/^#[0-9A-F]{6}$/.test(hexCode)) throw new Error("Use a six-digit hex color, for example #000000.");
  return { name, hexCode, isActive: Boolean(body.isActive) };
}

export async function GET() {
  const error = await requireAdmin();
  if (error) return error;
  return NextResponse.json(await prisma.color.findMany({ orderBy: { name: "asc" } }));
}

export async function POST(request: Request) {
  const error = await requireAdmin();
  if (error) return error;
  try {
    return NextResponse.json(await prisma.color.create({ data: input(await request.json()) }), { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") return NextResponse.json({ error: "A color with this name already exists." }, { status: 400 });
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to save color." }, { status: 400 });
  }
}
