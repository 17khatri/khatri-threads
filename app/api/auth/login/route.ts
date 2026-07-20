import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validators/login";
import { createToken } from "@/lib/auth/jwt";
import { AUTH_COOKIE_NAME, AUTH_COOKIE_OPTIONS } from "@/lib/auth/cookie";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const parsed = loginSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Please check the highlighted fields.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        phone: parsed.data.phone,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "Invalid phone number or password.",
        },
        {
          status: 401,
        }
      );
    }

    const passwordMatched = await bcrypt.compare(
      parsed.data.password,
      user.passwordHash
    );

    if (!passwordMatched) {
      return NextResponse.json(
        {
          error: "Invalid phone number or password.",
        },
        {
          status: 401,
        }
      );
    }

    const token = createToken({
      id: user.id,
      role: user.role,
      phone: user.phone,
    });

    const response = NextResponse.json({
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        officeName: user.officeName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });

    response.cookies.set(AUTH_COOKIE_NAME, token, AUTH_COOKIE_OPTIONS);

    return response;
  } catch (error) {
    console.error("Login failed", error);

    return NextResponse.json(
      {
        error: "Unable to login. Please try again later.",
      },
      {
        status: 500,
      }
    );
  }
}
