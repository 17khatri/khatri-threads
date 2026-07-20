import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_MAX_AGE_SECONDS = 10 * 60;
const COOKIE_NAME = "khushi_password_reset";

interface PasswordResetPayload {
  email: string;
  exp: number;
}

function getSecret() {
  const secret =
    process.env.PASSWORD_RESET_SECRET ||
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET;

  if (secret) {
    return secret;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("PASSWORD_RESET_SECRET is not configured.");
  }

  return "development-password-reset-secret";
}

function sign(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("base64url");
}

export function createPasswordResetCookie(email: string) {
  const payload: PasswordResetPayload = {
    email,
    exp: Date.now() + COOKIE_MAX_AGE_SECONDS * 1000,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
    "base64url",
  );

  return `${encodedPayload}.${sign(encodedPayload)}`;
}

export function readPasswordResetEmail(value?: string) {
  if (!value) {
    return null;
  }

  const [encodedPayload, signature] = value.split(".");

  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = sign(encodedPayload);
  const signatureBytes = Buffer.from(signature);
  const expectedSignatureBytes = Buffer.from(expectedSignature);

  if (
    signatureBytes.length !== expectedSignatureBytes.length ||
    !timingSafeEqual(signatureBytes, expectedSignatureBytes)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8"),
    ) as PasswordResetPayload;

    if (!payload.email || payload.exp < Date.now()) {
      return null;
    }

    return payload.email;
  } catch {
    return null;
  }
}

export const passwordResetCookie = {
  name: COOKIE_NAME,
  maxAge: COOKIE_MAX_AGE_SECONDS,
};
