import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import {
  createEmailVerificationCookie,
  emailVerificationCookie,
} from "@/lib/email-verification";
import { prisma } from "@/lib/prisma";
import { otpSchema } from "@/lib/validators/registration";

const MAX_OTP_ATTEMPTS = 5;

export const runtime = "nodejs";

export async function POST(request: Request) {
  const parsed = otpSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Enter the 6 digit OTP.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  try {
    const emailOtp = await prisma.emailOtp.findUnique({
      where: {
        email: parsed.data.email,
      },
    });

    if (!emailOtp || emailOtp.expiresAt.getTime() <= Date.now()) {
      if (emailOtp) {
        await prisma.emailOtp.delete({
          where: {
            email: parsed.data.email,
          },
        });
      }

      return NextResponse.json(
        { error: "Invalid or expired OTP." },
        { status: 401 },
      );
    }

    if (emailOtp.attempts >= MAX_OTP_ATTEMPTS) {
      await prisma.emailOtp.delete({
        where: {
          email: parsed.data.email,
        },
      });

      return NextResponse.json(
        { error: "Too many incorrect attempts. Please request a new OTP." },
        { status: 429 },
      );
    }

    const isValidOtp = await bcrypt.compare(parsed.data.otp, emailOtp.otpHash);

    if (!isValidOtp) {
      if (emailOtp.attempts + 1 >= MAX_OTP_ATTEMPTS) {
        await prisma.emailOtp.delete({
          where: {
            email: parsed.data.email,
          },
        });

        return NextResponse.json(
          { error: "Too many incorrect attempts. Please request a new OTP." },
          { status: 429 },
        );
      }

      await prisma.emailOtp.update({
        where: {
          email: parsed.data.email,
        },
        data: {
          attempts: {
            increment: 1,
          },
        },
      });

      return NextResponse.json(
        { error: "Invalid or expired OTP." },
        { status: 401 },
      );
    }

    await prisma.emailOtp.delete({
      where: {
        email: parsed.data.email,
      },
    });

    const response = NextResponse.json({ ok: true });
    response.cookies.set(
      emailVerificationCookie.name,
      createEmailVerificationCookie(parsed.data.email),
      {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: emailVerificationCookie.maxAge,
      },
    );

    return response;
  } catch (error) {
    console.error("Verify OTP failed", error);
    return NextResponse.json(
      { error: "Unable to verify OTP. Please try again later." },
      { status: 500 },
    );
  }
}
