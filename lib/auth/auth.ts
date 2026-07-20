import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";
import type { AuthUser } from "@/types/auth";
import { AUTH_COOKIE_NAME } from "./cookie";
import { verifyToken } from "./jwt";

export async function getCurrentUserId() {
  const cookieStore = await cookies();

  const token = cookieStore.get(AUTH_COOKIE_NAME);

  if (!token) {
    return null;
  }

  try {
    return verifyToken(token.value);
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const payload = await getCurrentUserId();

  if (!payload) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: payload.id,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      officeName: true,
      email: true,
      phone: true,
      role: true,
    },
  });

  return user;
}
