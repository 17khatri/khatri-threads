"use client";

import Button from "@/app/components/button";
import { FormField, Input } from "@/app/components/form-fields";
import { H1, P } from "@/app/components/typography";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/app/hooks/use-auth";

export default function Page() {
  const { login, loading } = useAuth();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");

    try {
      await login({
        phone,
        password,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to login.");
    }
  }

  return (
    <div className="flex max-w-6xl overflow-hidden rounded-3xl bg-panel shadow-2xl items-center justify-center px-4">
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <H1>Sign In</H1>

            <P className="mt-2 text-muted">
              Enter your credentials to continue.
            </P>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <FormField label="Mobile Number" required>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your number"
              />
            </FormField>

            <FormField label="Password" required>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </FormField>

            <div className="flex items-center justify-end">
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-primary hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {error && <p className="form-error">{error}</p>}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <P className="text-muted">
              Do not have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-primary hover:underline"
              >
                Register
              </Link>
            </P>
          </div>
        </div>
      </div>
    </div>
  );
}
