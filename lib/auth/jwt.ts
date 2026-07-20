import jwt, { SignOptions } from "jsonwebtoken";
import type { Role } from "@prisma/client";

const JWT_OPTIONS: SignOptions = {
  expiresIn: 8 * 60 * 60, // 8 hours
};

export type JwtPayload = {
  id: string;
  role: Role;
  phone: string;
};

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured.");
  }

  return secret;
}

export function createToken(payload: JwtPayload): string {
  return jwt.sign(payload, getJwtSecret(), JWT_OPTIONS);
}

export function verifyToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, getJwtSecret());

  if (typeof decoded === "string") {
    throw new Error("Invalid JWT payload.");
  }

  return decoded as JwtPayload;
}
