"use client";

import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import {
  FiCheckCircle,
  FiCircle,
  FiEye,
  FiEyeOff,
  FiLock,
  FiPhone,
  FiUser,
} from "react-icons/fi";
import Button from "@/app/components/button";
import { FormField, Input } from "@/app/components/form-fields";
import type { RegistrationDetailsValues } from "@/lib/validators/registration";

interface RegistrationDetailsProps {
  form: UseFormReturn<RegistrationDetailsValues>;
  isLoading: boolean;
  onSubmit: (event?: React.BaseSyntheticEvent) => Promise<void>;
}

export function RegistrationDetails({
  form,
  isLoading,
  onSubmit,
}: RegistrationDetailsProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordGuideOpen, setIsPasswordGuideOpen] = useState(false);
  const password = form.watch("password");
  const confirmPassword = form.watch("confirmPassword");
  const passwordInputType = showPassword ? "text" : "password";
  const passwordRequirements = [
    { label: "At least 8 characters", isMet: (password || "").length >= 8 },
    {
      label: "One uppercase letter",
      isMet: /[A-Z]/.test(password || ""),
    },
    {
      label: "One lowercase letter",
      isMet: /[a-z]/.test(password || ""),
    },
    { label: "One number", isMet: /\d/.test(password || "") },
    {
      label: "One special character",
      isMet: /[^A-Za-z0-9]/.test(password || ""),
    },
  ];
  const passwordsMatch =
    Boolean(password) &&
    Boolean(confirmPassword) &&
    password === confirmPassword;
  const completedRequirements = passwordRequirements.filter(
    (requirement) => requirement.isMet
  ).length;
  const hasStrongPassword =
    completedRequirements === passwordRequirements.length;

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          label="First Name"
          htmlFor="first-name"
          required
          error={form.formState.errors.firstName?.message}
        >
          <Input
            id="first-name"
            autoComplete="given-name"
            placeholder="First name"
            disabled={isLoading}
            {...form.register("firstName")}
          />
        </FormField>

        <FormField
          label="Last Name"
          htmlFor="last-name"
          required
          error={form.formState.errors.lastName?.message}
        >
          <Input
            id="last-name"
            autoComplete="family-name"
            placeholder="Last name"
            disabled={isLoading}
            {...form.register("lastName")}
          />
        </FormField>
      </div>

      <FormField
        label="Office Name"
        htmlFor="office-name"
        required
        error={form.formState.errors.officeName?.message}
      >
        <div className="relative">
          <FiUser
            aria-hidden="true"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
            size={18}
          />
          <Input
            id="office-name"
            autoComplete="organization"
            placeholder="Office or business name"
            className="pl-11"
            disabled={isLoading}
            {...form.register("officeName")}
          />
        </div>
      </FormField>

      <FormField
        label="Phone Number"
        htmlFor="phone-number"
        required
        error={form.formState.errors.phone?.message}
      >
        <div className="relative">
          <FiPhone
            aria-hidden="true"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
            size={18}
          />
          <Input
            id="phone-number"
            inputMode="numeric"
            autoComplete="tel"
            maxLength={10}
            placeholder="10 digit phone number"
            className="pl-11"
            disabled={isLoading}
            {...form.register("phone")}
          />
        </div>
      </FormField>

      <div
        className="relative grid gap-4 sm:grid-cols-2"
        onFocusCapture={() => setIsPasswordGuideOpen(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setIsPasswordGuideOpen(false);
          }
        }}
      >
        <FormField
          label="Password"
          htmlFor="password"
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
              id="password"
              type={passwordInputType}
              autoComplete="new-password"
              aria-describedby="password-guide"
              placeholder="Create password"
              className="pl-11 pr-12"
              disabled={isLoading}
              {...form.register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>
        </FormField>

        <FormField
          label="Confirm Password"
          htmlFor="confirm-password"
          required
          error={form.formState.errors.confirmPassword?.message}
        >
          <Input
            id="confirm-password"
            type={passwordInputType}
            autoComplete="new-password"
            placeholder="Confirm password"
            disabled={isLoading}
            {...form.register("confirmPassword")}
          />
        </FormField>

        <div
          id="password-guide"
          role="tooltip"
          aria-live="polite"
          className={`absolute left-0 top-full z-20 mt-3 w-full origin-top rounded-2xl border border-gray-200 bg-panel p-4 shadow-xl shadow-black/10 transition-all duration-200 sm:w-[340px] ${
            isPasswordGuideOpen
              ? "translate-y-0 scale-100 opacity-100"
              : "pointer-events-none -translate-y-2 scale-95 opacity-0"
          }`}
        >
          <span
            aria-hidden="true"
            className="absolute -top-2 left-8 h-4 w-4 rotate-45 border-l border-t border-gray-200 bg-panel"
          />
          <div className="relative flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-black">
                {hasStrongPassword ? "Strong password" : "Password guide"}
              </p>
              <p className="mt-0.5 text-xs text-muted">
                {hasStrongPassword
                  ? "Your password meets all requirements."
                  : "Add the following to strengthen it."}
              </p>
            </div>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-bold tabular-nums ${
                hasStrongPassword
                  ? "bg-success/10 text-success"
                  : "bg-primary/15 text-primary"
              }`}
            >
              {completedRequirements}/{passwordRequirements.length}
            </span>
          </div>

          <div className="mt-3 flex gap-1.5">
            {passwordRequirements.map((requirement) => (
              <span
                key={requirement.label}
                className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                  requirement.isMet ? "bg-success" : "bg-gray-200"
                }`}
              />
            ))}
          </div>

          <ul className="mt-4 space-y-2.5">
            {passwordRequirements.map((requirement) => (
              <li
                key={requirement.label}
                className={`flex items-center gap-2 text-sm transition-colors duration-300 ${
                  requirement.isMet ? "font-medium text-success" : "text-muted"
                }`}
              >
                {requirement.isMet ? (
                  <FiCheckCircle
                    aria-hidden="true"
                    size={17}
                    className="shrink-0"
                  />
                ) : (
                  <FiCircle
                    aria-hidden="true"
                    size={17}
                    className="shrink-0 text-primary"
                  />
                )}
                {requirement.label}
              </li>
            ))}
            <li
              className={`flex items-center gap-2 text-sm transition-colors duration-300 ${
                passwordsMatch ? "font-medium text-success" : "text-muted"
              }`}
            >
              {passwordsMatch ? (
                <FiCheckCircle
                  aria-hidden="true"
                  size={17}
                  className="shrink-0"
                />
              ) : (
                <FiCircle
                  aria-hidden="true"
                  size={17}
                  className="shrink-0 text-primary"
                />
              )}
              Passwords match
            </li>
          </ul>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          label="Address"
          htmlFor="address"
          error={form.formState.errors.address?.message}
        >
          <Input
            id="address"
            autoComplete="street-address"
            placeholder="Address"
            disabled={isLoading}
            {...form.register("address")}
          />
        </FormField>

        <FormField
          label="City"
          htmlFor="city"
          error={form.formState.errors.city?.message}
        >
          <Input
            id="city"
            autoComplete="address-level2"
            placeholder="City"
            disabled={isLoading}
            {...form.register("city")}
          />
        </FormField>

        <FormField
          label="State"
          htmlFor="state"
          error={form.formState.errors.state?.message}
        >
          <Input
            id="state"
            autoComplete="address-level1"
            placeholder="State"
            disabled={isLoading}
            {...form.register("state")}
          />
        </FormField>

        <FormField
          label="Pincode"
          htmlFor="pincode"
          error={form.formState.errors.pincode?.message}
        >
          <Input
            id="pincode"
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={6}
            placeholder="Pincode"
            disabled={isLoading}
            {...form.register("pincode")}
          />
        </FormField>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating account..." : "Register"}
      </Button>
    </form>
  );
}
