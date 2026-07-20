"use client";

import { useEffect, useState } from "react";

import Header from "@/app/components/dashboard/header";
import Sidebar from "@/app/components/dashboard/sidebar";
import { useAuthStore } from "@/store/auth-store";
import type { AuthUser } from "@/types/auth";

interface DashboardShellProps {
  children: React.ReactNode;
  initialUser: AuthUser;
}

export default function DashboardShell({
  children,
  initialUser,
}: DashboardShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    setUser(initialUser);
  }, [initialUser, setUser]);

  return (
    <div className="flex min-h-screen gap-4 bg-slate-100 p-4">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex flex-1 flex-col">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
