import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { getCurrentUser, getCurrentUserId } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { profileSchema } from "@/lib/validators/profile";

export const runtime = "nodejs";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({ user });
}

function optionalValue(value: string) {
  return value.trim() || null;
}

export async function PATCH(request: Request) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = profileSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Please check the highlighted fields.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  try {
    const data = parsed.data;
    const user = await prisma.user.update({
      where: { id: userId.id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        address: optionalValue(data.address),
        city: optionalValue(data.city),
        state: optionalValue(data.state),
        pincode: optionalValue(data.pincode),
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        address: true,
        city: true,
        state: true,
        pincode: true,
        role: true,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Email or phone number is already registered." },
        { status: 409 },
      );
    }

    console.error("Unable to update profile", error);
    return NextResponse.json(
      { error: "Unable to update profile. Please try again later." },
      { status: 500 },
    );
  }
}
