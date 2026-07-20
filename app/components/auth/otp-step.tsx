"use client";

import type { UseFormReturn } from "react-hook-form";
import { FiRotateCcw, FiShield } from "react-icons/fi";
import Button from "@/app/components/button";
import { FormField, Input } from "@/app/components/form-fields";
import type { OtpFormValues } from "@/lib/validators/registration";

interface OtpStepProps {
  form: UseFormReturn<OtpFormValues>;
  email: string;
  isLoading: boolean;
  resendCountdown: number;
  onSubmit: (event?: React.BaseSyntheticEvent) => Promise<void>;
  onResend: () => Promise<void>;
  onChangeEmail: () => void;
}

export function OtpStep({
  form,
  email,
  isLoading,
  resendCountdown,
  onSubmit,
  onResend,
  onChangeEmail,
}: OtpStepProps) {
  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <div className="rounded-2xl border border-line bg-background p-4">
        <p className="text-sm text-muted">OTP sent to</p>
        <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
          <strong className="break-all text-sm text-black">{email}</strong>
          <button
            type="button"
            onClick={onChangeEmail}
            className="text-sm font-semibold text-primary hover:underline"
            disabled={isLoading}
          >
            Change Email
          </button>
        </div>
      </div>

      <FormField
        label="Verification code"
        htmlFor="registration-otp"
        required
        error={form.formState.errors.otp?.message}
      >
        <div className="relative">
          <FiShield
            aria-hidden="true"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
            size={18}
          />
          <Input
            id="registration-otp"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="000000"
            className="pl-11 tracking-[0.35em]"
            disabled={isLoading}
            {...form.register("otp")}
          />
        </div>
      </FormField>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Verifying..." : "Verify OTP"}
      </Button>

      <button
        type="button"
        onClick={onResend}
        disabled={isLoading || resendCountdown > 0}
        className="mx-auto flex items-center gap-2 text-sm font-semibold text-primary disabled:cursor-not-allowed disabled:text-muted"
      >
        <FiRotateCcw size={16} />
        {resendCountdown > 0
          ? `Resend OTP in ${resendCountdown}s`
          : "Resend OTP"}
      </button>
    </form>
  );
}
