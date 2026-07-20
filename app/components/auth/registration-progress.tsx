"use client";

import { FiCheck, FiMail, FiShield, FiUser } from "react-icons/fi";
import { cn } from "@/lib/utils";
import type { RegistrationStep } from "@/types/registration";

interface RegistrationProgressProps {
  currentStep: RegistrationStep;
}

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
    label: "Details",
    icon: FiUser,
  },
] as const;

export function RegistrationProgress({
  currentStep,
}: RegistrationProgressProps) {
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
