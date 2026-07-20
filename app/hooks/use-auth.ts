"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ROUTES from "@/helper/routes";
import { useAuthStore } from "@/store/auth-store";

type LoginPayload = {
  phone: string;
  password: string;
};

export function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { setUser, clearUser } = useAuthStore();

  async function login(payload: LoginPayload) {
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include", // Important: allow cookies
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }
      setUser(data.user);
      router.push(ROUTES.DASHBOARD);

      return data.user;
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    router.replace(ROUTES.LOGIN);
    clearUser();
  }

  return {
    login,
    logout,
    loading,
  };
}
