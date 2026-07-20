import { z } from "zod";

export const loginSchema = z.object({
  phone: z
    .string()
    .trim()
    .regex(/^[0-9]{10}$/, "Enter a valid mobile number."),

  password: z.string().min(1, "Password is required."),
});

export type LoginInput = z.infer<typeof loginSchema>;
