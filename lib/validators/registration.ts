import { z } from "zod";

const requiredText = (field: string, min = 2) =>
  z
    .string()
    .trim()
    .min(1, `${field} is required.`)
    .min(min, `${field} must be at least ${min} characters.`);

const optionalText = z.string().trim();

export const emailSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("Enter a valid email address.")
    .toLowerCase(),
});

export const otpSchema = emailSchema.extend({
  otp: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Enter the 6 digit OTP."),
});

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .regex(/[A-Z]/, "Password must include at least one uppercase letter.")
  .regex(/[a-z]/, "Password must include at least one lowercase letter.")
  .regex(/\d/, "Password must include at least one number.")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must include at least one special character.",
  );

export const registrationDetailsSchema = z
  .object({
    firstName: requiredText("First name"),
    lastName: requiredText("Last name"),
    officeName: requiredText("Office name"),
    phone: z
      .string()
      .trim()
      .regex(/^\d{10}$/, "Phone number must be exactly 10 digits."),
    password: passwordSchema,
    confirmPassword: z.string(),
    address: optionalText,
    city: optionalText,
    state: optionalText,
    pincode: z
      .string()
      .trim()
      .refine((value) => !value || /^\d{6}$/.test(value), {
        message: "Pincode must be 6 digits.",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const registerSchema = registrationDetailsSchema.extend({
  email: emailSchema.shape.email,
});

export type EmailFormValues = z.infer<typeof emailSchema>;
export type OtpFormValues = z.infer<typeof otpSchema>;
export type RegistrationDetailsValues = z.infer<typeof registrationDetailsSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
