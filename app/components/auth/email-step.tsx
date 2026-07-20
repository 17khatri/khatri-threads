"use client";

import type { UseFormReturn } from "react-hook-form";
import { FiMail } from "react-icons/fi";
import Button from "@/app/components/button";
import { FormField, Input } from "@/app/components/form-fields";
import type { EmailFormValues } from "@/lib/validators/registration";

interface EmailStepProps {
  form: UseFormReturn<EmailFormValues>;
  isLoading: boolean;
  onSubmit: (event?: React.BaseSyntheticEvent) => Promise<void>;
}

export function EmailStep({ form, isLoading, onSubmit }: EmailStepProps) {
  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <FormField
        label="Email address"
        htmlFor="registration-email"
        required
        error={form.formState.errors.email?.message}
      >
        <div className="relative">
          <FiMail
            aria-hidden="true"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
            size={18}
          />
          <Input
            id="registration-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="pl-11"
            disabled={isLoading}
            {...form.register("email")}
          />
        </div>
      </FormField>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Sending OTP..." : "Send OTP"}
      </Button>
    </form>
  );
}
