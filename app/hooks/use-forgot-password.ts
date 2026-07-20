"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm, type SubmitHandler } from "react-hook-form";

import ROUTES from "@/helper/routes";
import {
  forgotPasswordEmailSchema,
  forgotPasswordOtpSchema,
  resetPasswordSchema,
  type ForgotPasswordEmailValues,
  type ForgotPasswordOtpValues,
  type ResetPasswordValues,
} from "@/lib/validators/forgot-password";
import type { ApiErrorResponse } from "@/types/registration";

type ForgotPasswordStep = 1 | 2 | 3;
type LoadingAction = "send-otp" | "verify-otp" | "reset" | "resend-otp";
const OTP_RESEND_WAIT_MS = 60_000;

class ForgotPasswordApiError extends Error {
  retryAfterSeconds?: number;

  constructor(message: string, retryAfterSeconds?: number) {
    super(message);
    this.name = "ForgotPasswordApiError";
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

async function readApiError(response: Response, fallback: string) {
  const body = (await response.json().catch(() => null)) as
    | ApiErrorResponse
    | null;

  return new ForgotPasswordApiError(
    body?.error || fallback,
    body?.retryAfterSeconds,
  );
}

export function useForgotPassword() {
  const router = useRouter();
  const [step, setStep] = useState<ForgotPasswordStep>(1);
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [loadingAction, setLoadingAction] = useState<LoadingAction | null>(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [resendAvailableAt, setResendAvailableAt] = useState<number | null>(
    null,
  );
  const [now, setNow] = useState(() => Date.now());

  const emailForm = useForm<ForgotPasswordEmailValues>({
    resolver: zodResolver(forgotPasswordEmailSchema),
    defaultValues: {
      email: "",
    },
  });

  const otpForm = useForm<ForgotPasswordOtpValues>({
    resolver: zodResolver(forgotPasswordOtpSchema),
    defaultValues: {
      email: "",
      otp: "",
    },
  });

  const resetForm = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (!resendAvailableAt) {
      return;
    }

    const interval = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(interval);
  }, [resendAvailableAt]);

  const resendCountdown = useMemo(() => {
    if (!resendAvailableAt) {
      return 0;
    }

    return Math.max(0, Math.ceil((resendAvailableAt - now) / 1000));
  }, [now, resendAvailableAt]);

  const sendOtpRequest = useCallback(async (email: string) => {
    const response = await fetch("/api/auth/forgot-password/send-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw await readApiError(
        response,
        "Unable to send OTP. Please try again.",
      );
    }
  }, []);

  const sendOtp: SubmitHandler<ForgotPasswordEmailValues> = async (values) => {
    setError("");
    setSuccessMessage("");
    setLoadingAction("send-otp");

    try {
      await sendOtpRequest(values.email);
      setVerifiedEmail(values.email);
      otpForm.reset({
        email: values.email,
        otp: "",
      });
      resetForm.reset({
        email: values.email,
        password: "",
        confirmPassword: "",
      });
      setResendAvailableAt(Date.now() + OTP_RESEND_WAIT_MS);
      setStep(2);
      setSuccessMessage("If this email exists, an OTP has been sent.");
    } catch (requestError) {
      if (requestError instanceof ForgotPasswordApiError) {
        setResendAvailableAt(
          Date.now() + (requestError.retryAfterSeconds || 60) * 1000,
        );
      }

      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to send OTP. Please try again.",
      );
    } finally {
      setLoadingAction(null);
    }
  };

  const verifyOtp: SubmitHandler<ForgotPasswordOtpValues> = async (values) => {
    setError("");
    setSuccessMessage("");
    setLoadingAction("verify-otp");

    try {
      const response = await fetch("/api/auth/forgot-password/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw await readApiError(response, "Invalid or expired OTP.");
      }

      setStep(3);
      setSuccessMessage("Email verified. Enter a new password.");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Invalid or expired OTP.",
      );
    } finally {
      setLoadingAction(null);
    }
  };

  const resendOtp = async () => {
    if (!verifiedEmail || resendCountdown > 0) {
      return;
    }

    setError("");
    setSuccessMessage("");
    setLoadingAction("resend-otp");

    try {
      await sendOtpRequest(verifiedEmail);
      setResendAvailableAt(Date.now() + OTP_RESEND_WAIT_MS);
      setSuccessMessage("If this email exists, a new OTP has been sent.");
    } catch (requestError) {
      if (requestError instanceof ForgotPasswordApiError) {
        setResendAvailableAt(
          Date.now() + (requestError.retryAfterSeconds || 60) * 1000,
        );
      }

      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to resend OTP.",
      );
    } finally {
      setLoadingAction(null);
    }
  };

  const resetPassword: SubmitHandler<ResetPasswordValues> = async (values) => {
    if (!verifiedEmail) {
      setError("Please verify your email before resetting your password.");
      setStep(1);
      return;
    }

    setError("");
    setSuccessMessage("");
    setLoadingAction("reset");

    try {
      const response = await fetch("/api/auth/forgot-password/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          email: verifiedEmail,
        }),
      });

      if (!response.ok) {
        throw await readApiError(response, "Unable to reset password.");
      }

      router.replace(ROUTES.LOGIN);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to reset password.",
      );
    } finally {
      setLoadingAction(null);
    }
  };

  const changeEmail = () => {
    setStep(1);
    setSuccessMessage("");
    setError("");
    otpForm.reset({
      email: "",
      otp: "",
    });
  };

  return {
    step,
    verifiedEmail,
    emailForm,
    otpForm,
    resetForm,
    loadingAction,
    error,
    successMessage,
    resendCountdown,
    sendOtp,
    verifyOtp,
    resendOtp,
    resetPassword,
    changeEmail,
  };
}
