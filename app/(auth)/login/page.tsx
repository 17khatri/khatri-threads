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
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* =====================================================
          BACKGROUND IMAGE
      ====================================================== */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/background.png')",
        }}
      />

      {/* =====================================================
          VERY SUBTLE OVERLAY

          Keep this low because we want the background
          to remain clearly visible.
      ====================================================== */}
      <div className="absolute inset-0 bg-black/10" />

      {/* =====================================================
          LOGIN AREA
      ====================================================== */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8">
        {/* ===================================================
            GLASS LOGIN CARD

            IMPORTANT:
            - bg-white/10 = very transparent white
            - backdrop-blur-xl = blur the background behind card
            - border-white/30 = subtle glass border
        ==================================================== */}
        <div
          className="
            w-full
            max-w-[430px]
            overflow-hidden
            rounded-3xl

            border
            border-white/30

            bg-white/10

            backdrop-blur-xl

            shadow-[0_25px_80px_rgba(0,0,0,0.30)]
          "
        >
          <div className="px-7 py-9 sm:px-10 sm:py-10">
            {/* =================================================
                TOP DECORATIVE LINE
            ================================================== */}
            <div className="mb-6 flex justify-center">
              <div
                className="
                  h-[2px]
                  w-14
                  bg-[#e4b54f]
                  shadow-[0_0_10px_rgba(228,181,79,0.35)]
                "
              />
            </div>

            {/* =================================================
                HEADING
            ================================================== */}
            <div className="mb-8 text-center">
              <H1
                className="
                  text-[#f8f3e9]
                  drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)]
                "
              >
                Sign In
              </H1>

              <P
                className="
                  mt-2
                  text-[#eee5d8]
                  drop-shadow-[0_1px_3px_rgba(0,0,0,0.25)]
                "
              >
                Enter your credentials to continue.
              </P>
            </div>

            {/* =================================================
                LOGIN FORM
            ================================================== */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* =================================================
                  MOBILE NUMBER
              ================================================== */}
              <FormField label="Mobile Number" required>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your number"
                  className="
                    border
                    border-white/40

                    bg-white/10

                    text-[#fffaf2]

                    placeholder:text-white/60

                    backdrop-blur-sm

                    focus:border-[#e4b54f]

                    focus:bg-white/15

                    focus:ring-2
                    focus:ring-[#e4b54f]/30

                    transition-all
                    duration-200
                  "
                />
              </FormField>

              {/* =================================================
                  PASSWORD
              ================================================== */}
              <FormField label="Password" required>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="
                    border
                    border-white/40

                    bg-white/10

                    text-[#fffaf2]

                    placeholder:text-white/60

                    backdrop-blur-sm

                    focus:border-[#e4b54f]

                    focus:bg-white/15

                    focus:ring-2
                    focus:ring-[#e4b54f]/30

                    transition-all
                    duration-200
                  "
                />
              </FormField>

              {/* =================================================
                  FORGOT PASSWORD
              ================================================== */}
              <div className="flex items-center justify-end">
                <Link
                  href="/forgot-password"
                  className="
                    text-sm
                    font-medium

                    text-[#f2c85c]

                    drop-shadow-[0_1px_3px_rgba(0,0,0,0.35)]

                    transition-colors

                    hover:text-[#ffe09a]
                    hover:underline
                  "
                >
                  Forgot Password?
                </Link>
              </div>

              {/* =================================================
                  ERROR
              ================================================== */}
              {error && <p className="form-error">{error}</p>}

              {/* =================================================
                  SIGN IN BUTTON
              ================================================== */}
              <Button
                type="submit"
                className="
                  w-full

                  !bg-[#e0a316]
                  !text-white

                  shadow-[0_8px_25px_rgba(224,163,22,0.25)]

                  transition-all
                  duration-200

                  hover:!bg-[#efb52c]

                  hover:shadow-[0_10px_30px_rgba(224,163,22,0.35)]

                  active:scale-[0.99]
                "
                size="lg"
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            {/* =================================================
                REGISTER
            ================================================== */}
            <div className="mt-8 text-center">
              <P
                className="
                  text-[#eee5d8]
                  drop-shadow-[0_1px_3px_rgba(0,0,0,0.25)]
                "
              >
                Do not have an account?{" "}
                <Link
                  href="/register"
                  className="
                    font-semibold

                    text-[#f2c85c]

                    transition-colors

                    hover:text-[#ffe09a]
                    hover:underline
                  "
                >
                  Register
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
