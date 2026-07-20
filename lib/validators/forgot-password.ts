import { z } from "zod";

import { emailSchema, otpSchema, passwordSchema } from "./registration";

export const forgotPasswordEmailSchema = emailSchema;

export const forgotPasswordOtpSchema = otpSchema;

export const resetPasswordSchema = z
  .object({
    email: emailSchema.shape.email,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type ForgotPasswordEmailValues = z.infer<
  typeof forgotPasswordEmailSchema
>;
export type ForgotPasswordOtpValues = z.infer<typeof forgotPasswordOtpSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
