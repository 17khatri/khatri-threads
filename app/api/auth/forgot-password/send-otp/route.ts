import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { generateOtp } from "@/lib/otp";
import { prisma } from "@/lib/prisma";
import { sendOtpEmail } from "@/lib/send-email";
import { forgotPasswordEmailSchema } from "@/lib/validators/forgot-password";

const EMAIL_OTP_RETRY_AFTER_SECONDS = 60;
const EMAIL_OTP_EXPIRES_IN_MS = 5 * 60 * 1000;
const BCRYPT_SALT_ROUNDS = 12;
const GENERIC_SUCCESS_MESSAGE = "If this email exists, an OTP has been sent.";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const parsed = forgotPasswordEmailSchema.safeParse(
    await request.json().catch(() => null),
  );

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Enter a valid email address.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: parsed.data.email,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: GENERIC_SUCCESS_MESSAGE });
    }

    const existingOtp = await prisma.emailOtp.findUnique({
      where: {
        email: parsed.data.email,
      },
      select: {
        createdAt: true,
      },
    });

    if (existingOtp) {
      const retryAfterSeconds =
        EMAIL_OTP_RETRY_AFTER_SECONDS -
        Math.floor((Date.now() - existingOtp.createdAt.getTime()) / 1000);

      if (retryAfterSeconds > 0) {
        return NextResponse.json(
          {
            error: `Please wait ${retryAfterSeconds} seconds before requesting another OTP.`,
            retryAfterSeconds,
          },
          { status: 429 },
        );
      }
    }

    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, BCRYPT_SALT_ROUNDS);

    await prisma.emailOtp.deleteMany({
      where: {
        email: parsed.data.email,
      },
    });

    const createdOtp = await prisma.emailOtp.create({
      data: {
        email: parsed.data.email,
        otpHash,
        expiresAt: new Date(Date.now() + EMAIL_OTP_EXPIRES_IN_MS),
      },
    });

    try {
      await sendOtpEmail(parsed.data.email, otp);
    } catch (error) {
      await prisma.emailOtp.delete({
        where: {
          id: createdOtp.id,
        },
      });

      throw error;
    }

    return NextResponse.json({ message: GENERIC_SUCCESS_MESSAGE });
  } catch (error) {
    console.error("Forgot password OTP failed", error);
    return NextResponse.json(
      { error: "Unable to send OTP. Please try again later." },
      { status: 500 },
    );
  }
}
