"use client";

import Link from "next/link";
import { AuthCard } from "@/app/components/auth/auth-card";
import { EmailStep } from "@/app/components/auth/email-step";
import { OtpStep } from "@/app/components/auth/otp-step";
import { RegistrationDetails } from "@/app/components/auth/registration-details";
import { RegistrationProgress } from "@/app/components/auth/registration-progress";
import Button from "@/app/components/button";
import { P } from "@/app/components/typography";
import { useRegistration } from "@/app/hooks/use-registration";

export default function RegisterPage() {
  const registration = useRegistration();

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background px-4 py-8">
      <AuthCard
        title="Create Account"
        subtitle="Verify your email and complete your registration."
      >
        <RegistrationProgress currentStep={registration.step} />

        {registration.error && (
          <div className="mb-5 rounded-2xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">
            {registration.error}
          </div>
        )}

        {registration.successMessage && (
          <div className="mb-5 rounded-2xl border border-success/20 bg-success/10 px-4 py-3 text-sm font-semibold text-success">
            {registration.successMessage}
          </div>
        )}

        {registration.registeredUser ? (
          <div className="space-y-6 text-center">
            <div className="rounded-2xl border border-line bg-background p-5">
              <P className="text-black">
                Your account for {registration.registeredUser.officeName} is
                ready.
              </P>
            </div>
            <Button href="/login" className="w-full">
              Go to Login
            </Button>
          </div>
        ) : (
          <>
            {registration.step === 1 && (
              <EmailStep
                form={registration.emailForm}
                isLoading={registration.loadingAction === "send-otp"}
                onSubmit={registration.emailForm.handleSubmit(
                  registration.sendOtp
                )}
              />
            )}

            {registration.step === 2 && (
              <OtpStep
                form={registration.otpForm}
                email={registration.verifiedEmail}
                isLoading={
                  registration.loadingAction === "verify-otp" ||
                  registration.loadingAction === "resend-otp"
                }
                resendCountdown={registration.resendCountdown}
                onSubmit={registration.otpForm.handleSubmit(
                  registration.verifyOtp
                )}
                onResend={registration.resendOtp}
                onChangeEmail={registration.changeEmail}
              />
            )}

            {registration.step === 3 && (
              <RegistrationDetails
                form={registration.detailsForm}
                isLoading={registration.loadingAction === "register"}
                onSubmit={registration.detailsForm.handleSubmit(
                  registration.register
                )}
              />
            )}
          </>
        )}

        <div className="mt-8 text-center">
          <P className="text-muted">
            Already have an account?{" "}
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
