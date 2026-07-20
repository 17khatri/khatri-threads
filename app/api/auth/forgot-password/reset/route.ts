import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import {
  passwordResetCookie,
  readPasswordResetEmail,
} from "@/lib/password-reset";
import { prisma } from "@/lib/prisma";
import { resetPasswordSchema } from "@/lib/validators/forgot-password";

const BCRYPT_SALT_ROUNDS = 12;

export const runtime = "nodejs";

export async function POST(request: Request) {
  const parsed = resetPasswordSchema.safeParse(
    await request.json().catch(() => null),
  );

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Please check the highlighted fields.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const cookieStore = await cookies();
  const resetEmail = readPasswordResetEmail(
    cookieStore.get(passwordResetCookie.name)?.value,
  );

  if (resetEmail !== parsed.data.email) {
    return NextResponse.json(
      { error: "Please verify your email before resetting your password." },
      { status: 401 },
    );
  }

  try {
    const passwordHash = await bcrypt.hash(
      parsed.data.password,
      BCRYPT_SALT_ROUNDS,
    );

    await prisma.user.update({
      where: {
        email: parsed.data.email,
      },
      data: {
        passwordHash,
      },
    });

    const response = NextResponse.json({ ok: true });
    response.cookies.delete(passwordResetCookie.name);

    return response;
  } catch (error) {
    console.error("Password reset failed", error);
    return NextResponse.json(
      { error: "Unable to reset password. Please try again later." },
      { status: 500 },
    );
  }
}
