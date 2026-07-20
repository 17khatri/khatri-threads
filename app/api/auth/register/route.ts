import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  emailVerificationCookie,
  readVerifiedEmail,
} from "@/lib/email-verification";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validators/registration";

const BCRYPT_SALT_ROUNDS = 12;

export const runtime = "nodejs";

function optionalValue(value: string) {
  return value.trim() || undefined;
}

export async function POST(request: Request) {
  const parsed = registerSchema.safeParse(await request.json().catch(() => null));

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
  const verifiedEmail = readVerifiedEmail(
    cookieStore.get(emailVerificationCookie.name)?.value,
  );

  if (verifiedEmail !== parsed.data.email) {
    return NextResponse.json(
      { error: "Please verify your email before registering." },
      { status: 401 },
    );
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: parsed.data.email },
        { phone: parsed.data.phone },
      ],
    },
    select: {
      email: true,
      phone: true,
    },
  });

  if (existingUser) {
    const field =
      existingUser.email === parsed.data.email
        ? "email"
        : existingUser.phone === parsed.data.phone
          ? "phone"
          : "email";

    return NextResponse.json(
      {
        error:
          field === "phone"
            ? "Phone number is already registered."
            : "Email is already registered.",
      },
      { status: 409 },
    );
  }

  try {
    const passwordHash = await bcrypt.hash(
      parsed.data.password,
      BCRYPT_SALT_ROUNDS,
    );

    const user = await prisma.user.create({
      data: {
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        officeName: parsed.data.officeName,
        email: parsed.data.email,
        emailVerified: true,
        phone: parsed.data.phone,
        passwordHash,
        address: optionalValue(parsed.data.address),
        city: optionalValue(parsed.data.city),
        state: optionalValue(parsed.data.state),
        pincode: optionalValue(parsed.data.pincode),
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        officeName: true,
        email: true,
        phone: true,
        address: true,
        city: true,
        state: true,
        pincode: true,
      },
    });

    const response = NextResponse.json({ user }, { status: 201 });
    response.cookies.delete(emailVerificationCookie.name);

    return response;
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

    console.error(error);
    return NextResponse.json(
      { error: "Unable to create account. Please try again later." },
      { status: 500 },
    );
  }
}
