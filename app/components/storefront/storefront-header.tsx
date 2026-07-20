"use client";

import { FiMenu, FiSearch, FiShoppingCart, FiUser, FiX } from "react-icons/fi";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function StorefrontHeader() {
  const [isMenuMounted, setIsMenuMounted] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const closeTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
    };
  }, []);

  const openMenu = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setIsMenuMounted(true);
    window.requestAnimationFrame(() => setIsMenuVisible(true));
  };

  const closeMenu = () => {
    setIsMenuVisible(false);
    closeTimer.current = window.setTimeout(() => setIsMenuMounted(false), 200);
  };

  return (
    <>
      <header className="relative flex items-center justify-between py-4 sm:py-5">
        <div className="hidden items-center gap-8 md:flex lg:gap-10">
          <Link
            href="/"
            className="text-base font-bold tracking-tight lg:text-lg text-primary"
          >
            Khatri Threads
          </Link>
          <nav className="flex items-center gap-5 text-sm text-slate-700 lg:gap-6">
            <a href="#collection" className="hover:text-primary">
              Shop
            </a>
            <a href="#about" className="hover:text-primary">
              Contact
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-5 md:hidden">
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={isMenuVisible}
            onClick={openMenu}
            className="hover:text-primary"
          >
            <FiMenu size={20} />
          </button>
          <button
            type="button"
            aria-label="Search products"
            className="hover:text-primary"
          >
            <FiSearch size={20} />
          </button>
        </div>

        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 text-base font-bold tracking-tight md:hidden text-primary"
        >
          Khatri Threads
        </Link>

        <div className="flex items-center gap-4 text-slate-900 sm:gap-6">
          <button
            type="button"
            aria-label="Search products"
            className="hidden hover:text-primary md:block"
          >
            <FiSearch size={20} />
          </button>
          <Link
            href="/login"
            aria-label="Account"
            className="hover:text-primary"
          >
            <FiUser size={20} />
          </Link>
          <button
            type="button"
            aria-label="Shopping bag, 1 item"
            className="relative hover:text-primary"
          >
            <FiShoppingCart size={21} />
          </button>
        </div>
      </header>

      {isMenuMounted &&
        createPortal(
          <div className="fixed inset-0 z-50 md:hidden">
            <button
              type="button"
              aria-label="Close menu"
              className={`absolute inset-0 z-0 bg-black/30 transition-opacity duration-200 ${
                isMenuVisible ? "opacity-100" : "opacity-0"
              }`}
              onClick={closeMenu}
            />
            <aside
              className={`relative z-10 flex h-dvh w-[min(20rem,85vw)] flex-col bg-white px-6 py-5 shadow-xl transition-transform duration-200 ease-out ${
                isMenuVisible ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold tracking-tight">
                  Khatri Threads
                </span>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={closeMenu}
                >
                  <FiX size={22} />
                </button>
              </div>
              <nav className="mt-12 flex flex-col border-t border-slate-100">
                <a
                  href="#collection"
                  onClick={closeMenu}
                  className="border-b border-slate-100 py-5 text-lg font-medium"
                >
                  Shop
                </a>
                <a
                  href="#about"
                  onClick={closeMenu}
                  className="border-b border-slate-100 py-5 text-lg font-medium"
                >
                  Contact
                </a>
              </nav>
            </aside>
          </div>,
          document.body
        )}
    </>
  );
}
