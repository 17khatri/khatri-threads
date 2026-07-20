"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import {
  emailSchema,
  otpSchema,
  registrationDetailsSchema,
  type EmailFormValues,
  type OtpFormValues,
  type RegistrationDetailsValues,
} from "@/lib/validators/registration";
import type {
  ApiErrorResponse,
  RegisteredUser,
  RegistrationStep,
} from "@/types/registration";

type LoadingAction = "send-otp" | "verify-otp" | "register" | "resend-otp";
const OTP_RESEND_WAIT_MS = 60_000;

interface RegisterResponse {
  user: RegisteredUser;
}

class RegistrationApiError extends Error {
  retryAfterSeconds?: number;

  constructor(message: string, retryAfterSeconds?: number) {
    super(message);
    this.name = "RegistrationApiError";
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

async function readApiError(response: Response, fallback: string) {
  const body = (await response.json().catch(() => null)) as
    | ApiErrorResponse
    | null;

  return new RegistrationApiError(
    body?.error || fallback,
    body?.retryAfterSeconds,
  );
}

export function useRegistration() {
  const [step, setStep] = useState<RegistrationStep>(1);
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [loadingAction, setLoadingAction] = useState<LoadingAction | null>(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [registeredUser, setRegisteredUser] = useState<RegisteredUser | null>(
    null,
  );
  const [resendAvailableAt, setResendAvailableAt] = useState<number | null>(
    null,
  );
  const [now, setNow] = useState(() => Date.now());

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      email: "",
      otp: "",
    },
  });

  const detailsForm = useForm<RegistrationDetailsValues>({
    resolver: zodResolver(registrationDetailsSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      officeName: "",
      phone: "",
      password: "",
      confirmPassword: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
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
    const response = await fetch("/api/auth/send-otp", {
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

  const sendOtp: SubmitHandler<EmailFormValues> = async (values) => {
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
      setResendAvailableAt(Date.now() + OTP_RESEND_WAIT_MS);
      setStep(2);
      setSuccessMessage("OTP sent to your email.");
    } catch (requestError) {
      if (requestError instanceof RegistrationApiError) {
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

  const verifyOtp: SubmitHandler<OtpFormValues> = async (values) => {
    setError("");
    setSuccessMessage("");
    setLoadingAction("verify-otp");

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw await readApiError(response, "Invalid or expired OTP.");
      }

      await response.json();
      setStep(3);
      setSuccessMessage("Email verified successfully.");
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
      setSuccessMessage("A new OTP has been sent.");
    } catch (requestError) {
      if (requestError instanceof RegistrationApiError) {
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

  const register: SubmitHandler<RegistrationDetailsValues> = async (values) => {
    if (!verifiedEmail) {
      setError("Please verify your email before registering.");
      setStep(1);
      return;
    }

    setError("");
    setSuccessMessage("");
    setLoadingAction("register");

    try {
      const response = await fetch("/api/auth/register", {
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
        throw await readApiError(response, "Unable to create account.");
      }

      const data = (await response.json()) as RegisterResponse;
      setRegisteredUser(data.user);
      setSuccessMessage("Account created successfully.");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to create account.",
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
    detailsForm,
    loadingAction,
    isLoading: loadingAction !== null,
    error,
    successMessage,
    registeredUser,
    resendCountdown,
    sendOtp,
    verifyOtp,
    resendOtp,
    register,
    changeEmail,
  };
}
