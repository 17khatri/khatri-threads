import { z } from "zod";

const requiredText = (field: string) =>
  z.string().trim().min(2, `${field} must be at least 2 characters.`);

const optionalText = (maxLength: number) => z.string().trim().max(maxLength);

export const profileSchema = z.object({
  firstName: requiredText("First name"),
  lastName: requiredText("Last name"),
  email: z.string().trim().email("Enter a valid email address.").toLowerCase(),
  phone: z.string().trim().regex(/^\d{10}$/, "Phone number must be exactly 10 digits."),
  address: optionalText(500),
  city: optionalText(100),
  state: optionalText(100),
  pincode: z
    .string()
    .trim()
    .refine((value) => !value || /^\d{6}$/.test(value), {
      message: "Pincode must be 6 digits.",
    }),
});
