"use client";

import Link from "next/link";
import {
  FiBarChart2,
  FiGrid,
  FiLogOut,
  FiPackage,
  FiUsers,
  FiX,
} from "react-icons/fi";
import ROUTES from "@/helper/routes";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { useAuth } from "@/app/hooks/use-auth";
import { H1 } from "../typography";
import Button from "../button";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const { logout } = useAuth();

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky
          top-0 left-0
          h-screen
          w-64
          bg-primary
          text-white
          z-50
          rounded-none
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          flex flex-col
        `}
      >
        <div className="p-5 border-b border-white/30">
          <H1 className="xl:text-xl">Khatri Threads</H1>

          <Button variant="unstyled" size="none" onClick={onClose} className="lg:hidden">
            <FiX />
          </Button>
        </div>

        <nav className="p-4 space-y-2 h-full overflow-auto">
          <Link
            href={ROUTES.ADMIN_DASHBOARD}
            onClick={onClose}
            className={`flex items-center gap-3 px-4 py-3 rounded-none transition-colors duration-300 ${
              pathname === ROUTES.ADMIN_DASHBOARD
                ? "bg-primary/60"
                : "hover:bg-primary/60"
            }`}
          >
            <FiGrid size={18} />
            Dashboard
          </Link>

          {user?.role === "ADMIN" && (
            <>
              <Link
                href={ROUTES.CATEGORIES}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-none transition-colors duration-300 ${
                  pathname === ROUTES.CATEGORIES
                    ? "bg-primary/60"
                    : "hover:bg-primary/60"
                }`}
              >
                <FiBarChart2 size={18} />
                Categories
              </Link>
              <Link
                href={ROUTES.ADMIN_COLORS}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-none transition-colors duration-300 ${
                  pathname === ROUTES.ADMIN_COLORS
                    ? "bg-primary/60"
                    : "hover:bg-primary/60"
                }`}
              >
                <FiBarChart2 size={18} />
                Colors
              </Link>
              <Link
                href={ROUTES.ADMIN_CUSTOMIZER_PRODUCTS}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-none transition-colors duration-300 ${
                  pathname === ROUTES.ADMIN_CUSTOMIZER_PRODUCTS
                    ? "bg-primary/60"
                    : "hover:bg-primary/60"
                }`}
              >
                <FiPackage size={18} />
                Customizer Products
              </Link>
              <Link
                href={ROUTES.ADMIN_COLLECTIONS}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-none transition-colors duration-300 ${
                  pathname === ROUTES.ADMIN_COLLECTIONS
                    ? "bg-primary/60"
                    : "hover:bg-primary/60"
                }`}
              >
                <FiBarChart2 size={18} />
                Collections
              </Link>
              <Link
                href={ROUTES.PRODUCTS}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-none transition-colors duration-300 ${
                  pathname === ROUTES.PRODUCTS
                    ? "bg-primary/60"
                    : "hover:bg-primary/60"
                }`}
              >
                <FiPackage size={18} />
                Products
              </Link>
              <Link
                href={ROUTES.USERS}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-none transition-colors duration-300 ${
                  pathname === ROUTES.USERS
                    ? "bg-primary/60"
                    : "hover:bg-primary/60"
                }`}
              >
                <FiUsers size={18} />
                Users
              </Link>
            </>
          )}
        </nav>

        {user && (
          <div className="p-4 border-t border-white/20 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-none bg-white/10 text-white font-semibold text-sm">
                {user.firstName[0]?.toUpperCase() || "U"}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-white truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-white/60 truncate">{user.email}</p>
              </div>
            </div>
            <Button variant="unstyled" size="none"
              onClick={() => logout()}
              title="Logout"
              className="p-2 rounded-none hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer shrink-0"
            >
              <FiLogOut size={18} />
            </Button>
          </div>
        )}
      </aside>
    </>
  );
}
