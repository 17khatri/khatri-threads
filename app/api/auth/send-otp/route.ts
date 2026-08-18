import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { generateOtp } from "@/lib/otp";
import { sendOtpEmail } from "@/lib/send-email";
import { emailSchema } from "@/lib/validators/registration";

const EMAIL_OTP_RETRY_AFTER_SECONDS = 60;
const EMAIL_OTP_EXPIRES_IN_MS = 5 * 60 * 1000;
const BCRYPT_SALT_ROUNDS = 12;

export const runtime = "nodejs";

export async function POST(request: Request) {
  const parsed = emailSchema.safeParse(await request.json().catch(() => null));

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
    const existingUser = await prisma.user.findUnique({
      where: {
        email: parsed.data.email,
      },
      select: {
        id: true,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email is already registered." },
        { status: 409 },
      );
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

    return NextResponse.json({ ok: otp });
  } catch (error) {
    console.error("Send OTP failed", error);
    return NextResponse.json(
      { error: "Unable to send OTP. Please try again later." },
      { status: 500 },
    );
  }
}
