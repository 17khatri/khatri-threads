"use client";

import Link from "next/link";
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
    <div className="relative min-h-screen w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/background.png')",
        }}
      />
      <div className="absolute inset-0 bg-black/10" />
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8">
        <div
          className="
            w-full max-w-[520px] overflow-hidden border border-white/30 bg-white/10 backdrop-blur-xl
          shadow-[0_25px_80px_rgba(0,0,0,0.30)]
          "
        >
          <div className="px-7 py-9 sm:px-10 sm:py-10">
            <div className="mb-6 flex justify-center">
              <div className="h-[2px] w-14 bg-[#e4b54f] shadow-[0_0_10px_rgba(228,181,79,0.35)]" />
            </div>
            <div className="text-center">
              <h1
                className=" text-3xl font-bold text-[#f8f3e9] drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)]
                "
              >
                Create Account
              </h1>

              <p
                className=" mt-2 text-[#eee5d8] drop-shadow-[0_1px_3px_rgba(0,0,0,0.25)]
"
              >
                Verify your email and complete your registration.
              </p>
            </div>
            <div className="mt-8">
              <RegistrationProgress currentStep={registration.step} />
            </div>
            {registration.error && (
              <div className="mb-5 mt-6 rounded-lg border border-red-300/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200 backdrop-blur-sm">
                {registration.error}
              </div>
            )}
            {registration.successMessage && (
              <div
                className="mb-5 mt-6 rounded-lg border border-green-300/30 bg-green-500/10 px-4 py-3 text-sm font-semibold text-green-200 backdrop-blur-sm
                "
              >
                {registration.successMessage}
              </div>
            )}
            {registration.registeredUser ? (
              <div className="space-y-6 text-center">
                <div
                  className="rounded-xl border border-white/30 bg-white/10 p-5 backdrop-blur-sm
                  "
                >
                  <P className="text-[#f5ead7]">Your account is ready.</P>
                </div>

                <Button
                  href="/login"
                  className="w-full !bg-[#e0a316] !text-white shadow-[0_8px_25px_rgba(224,163,22,0.25)] transition-all duration-200 hover:!bg-[#efb52c] hover:shadow-[0_10px_30px_rgba(224,163,22,0.35)]
                  "
                >
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
                      registration.sendOtp,
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
                      registration.verifyOtp,
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
                      registration.register,
                    )}
                  />
                )}
              </>
            )}
            <div className="mt-8 text-center">
              <P
                className="
                  text-[#eee5d8]
                  drop-shadow-[0_1px_3px_rgba(0,0,0,0.25)]
                "
              >
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="
                    font-semibold
                    text-[#f2c85c]
                    transition-colors
                    hover:text-[#ffe09a]
                    hover:underline
                  "
                >
                  Sign in
                </Link>
              </P>
            </div>

            {/* =================================================
                BOTTOM DECORATIVE LINE
            ================================================== */}
            <div className="mt-8 flex justify-center">
              <div
                className="
                  h-px
                  w-20
                  bg-[#e4b54f]/60
                  shadow-[0_0_8px_rgba(228,181,79,0.25)]
                "
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
