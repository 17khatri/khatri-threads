"use client";

import Link from "next/link";
import type { UseFormReturn } from "react-hook-form";
import { FiCheck, FiKey, FiLock, FiMail, FiRotateCcw, FiShield } from "react-icons/fi";

import { AuthCard } from "@/app/components/auth/auth-card";
import Button from "@/app/components/button";
import { FormField, Input } from "@/app/components/form-fields";
import { P } from "@/app/components/typography";
import { useForgotPassword } from "@/app/hooks/use-forgot-password";
import { cn } from "@/lib/utils";
import type {
  ForgotPasswordEmailValues,
  ForgotPasswordOtpValues,
  ResetPasswordValues,
} from "@/lib/validators/forgot-password";

type ForgotPasswordStep = 1 | 2 | 3;

const steps = [
  {
    step: 1,
    label: "Email",
    icon: FiMail,
  },
  {
    step: 2,
    label: "OTP",
    icon: FiShield,
  },
  {
    step: 3,
    label: "Reset",
    icon: FiKey,
  },
] as const;

function ForgotPasswordProgress({
  currentStep,
}: {
  currentStep: ForgotPasswordStep;
}) {
  return (
    <div className="mb-8 grid grid-cols-3 gap-3">
      {steps.map(({ step, label, icon: Icon }) => {
        const isComplete = step < currentStep;
        const isActive = step === currentStep;

        return (
          <div
            key={step}
            className={cn(
              "rounded-2xl border p-3 text-center",
              isActive || isComplete
                ? "border-primary bg-primary/10"
                : "border-line bg-background",
            )}
          >
            <div
              className={cn(
                "mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full",
                isComplete
                  ? "bg-success text-white"
                  : isActive
                    ? "bg-primary text-white"
                    : "bg-white text-muted",
              )}
            >
              {isComplete ? <FiCheck size={18} /> : <Icon size={18} />}
            </div>
            <span className="block text-xs font-semibold text-black">
              Step {step}
            </span>
            <span className="block text-xs text-muted">{label}</span>
          </div>
        );
      })}
    </div>
  );
}

function ForgotEmailStep({
  form,
  isLoading,
  onSubmit,
}: {
  form: UseFormReturn<ForgotPasswordEmailValues>;
  isLoading: boolean;
  onSubmit: (event?: React.BaseSyntheticEvent) => Promise<void>;
}) {
  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <FormField
        label="Email address"
        htmlFor="forgot-password-email"
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
            id="forgot-password-email"
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

function ForgotOtpStep({
  form,
  email,
  isLoading,
  resendCountdown,
  onSubmit,
  onResend,
  onChangeEmail,
}: {
  form: UseFormReturn<ForgotPasswordOtpValues>;
  email: string;
  isLoading: boolean;
  resendCountdown: number;
  onSubmit: (event?: React.BaseSyntheticEvent) => Promise<void>;
  onResend: () => Promise<void>;
  onChangeEmail: () => void;
}) {
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
        htmlFor="forgot-password-otp"
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
            id="forgot-password-otp"
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

function ResetPasswordStep({
  form,
  isLoading,
  onSubmit,
}: {
  form: UseFormReturn<ResetPasswordValues>;
  isLoading: boolean;
  onSubmit: (event?: React.BaseSyntheticEvent) => Promise<void>;
}) {
  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <FormField
        label="New password"
        htmlFor="forgot-password-new"
        required
        error={form.formState.errors.password?.message}
      >
        <div className="relative">
          <FiLock
            aria-hidden="true"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
            size={18}
          />
          <Input
            id="forgot-password-new"
            type="password"
            autoComplete="new-password"
            placeholder="Enter new password"
            className="pl-11"
            disabled={isLoading}
            {...form.register("password")}
          />
        </div>
      </FormField>

      <FormField
        label="Confirm password"
        htmlFor="forgot-password-confirm"
        required
        error={form.formState.errors.confirmPassword?.message}
      >
        <div className="relative">
          <FiLock
            aria-hidden="true"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
            size={18}
          />
          <Input
            id="forgot-password-confirm"
            type="password"
            autoComplete="new-password"
            placeholder="Confirm new password"
            className="pl-11"
            disabled={isLoading}
            {...form.register("confirmPassword")}
          />
        </div>
      </FormField>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Resetting..." : "Reset Password"}
      </Button>
    </form>
  );
}

export default function ForgotPasswordPage() {
  const forgotPassword = useForgotPassword();

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background px-4 py-8">
      <AuthCard
        title="Forgot Password"
        subtitle="Verify your email and set a new password."
      >
        <ForgotPasswordProgress currentStep={forgotPassword.step} />

        {forgotPassword.error && (
          <div className="mb-5 rounded-2xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">
            {forgotPassword.error}
          </div>
        )}

        {forgotPassword.successMessage && (
          <div className="mb-5 rounded-2xl border border-success/20 bg-success/10 px-4 py-3 text-sm font-semibold text-success">
            {forgotPassword.successMessage}
          </div>
        )}

        {forgotPassword.step === 1 && (
          <ForgotEmailStep
            form={forgotPassword.emailForm}
            isLoading={forgotPassword.loadingAction === "send-otp"}
            onSubmit={forgotPassword.emailForm.handleSubmit(
              forgotPassword.sendOtp,
            )}
          />
        )}

        {forgotPassword.step === 2 && (
          <ForgotOtpStep
            form={forgotPassword.otpForm}
            email={forgotPassword.verifiedEmail}
            isLoading={
              forgotPassword.loadingAction === "verify-otp" ||
              forgotPassword.loadingAction === "resend-otp"
            }
            resendCountdown={forgotPassword.resendCountdown}
            onSubmit={forgotPassword.otpForm.handleSubmit(
              forgotPassword.verifyOtp,
            )}
            onResend={forgotPassword.resendOtp}
            onChangeEmail={forgotPassword.changeEmail}
          />
        )}

        {forgotPassword.step === 3 && (
          <ResetPasswordStep
            form={forgotPassword.resetForm}
            isLoading={forgotPassword.loadingAction === "reset"}
            onSubmit={forgotPassword.resetForm.handleSubmit(
              forgotPassword.resetPassword,
            )}
          />
        )}

        <div className="mt-8 text-center">
          <P className="text-muted">
            Remembered your password?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary hover:underline"
            >
              Sign in
            </Link>
          </P>
        </div>
      </AuthCard>
    </div>
  );
}
