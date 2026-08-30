"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";
import { cn } from "@/lib/utils";

type DrawerProps = {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  className?: string;
};

export function Drawer({
  open,
  title,
  children,
  onClose,
  className,
}: DrawerProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const animationFrame = useRef<number | null>(null);
  const closeTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (animationFrame.current) {
        window.cancelAnimationFrame(animationFrame.current);
      }
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
    };
  }, []);

  useEffect(() => {
    if (animationFrame.current) {
      window.cancelAnimationFrame(animationFrame.current);
    }
    if (closeTimer.current) window.clearTimeout(closeTimer.current);

    if (open) {
      animationFrame.current = window.requestAnimationFrame(() => {
        setIsMounted(true);
        animationFrame.current = window.requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });
      return;
    }

    animationFrame.current = window.requestAnimationFrame(() => {
      setIsVisible(false);
    });
    closeTimer.current = window.setTimeout(() => setIsMounted(false), 200);
  }, [open]);

  useEffect(() => {
    if (!isMounted) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMounted]);

  useEffect(() => {
    if (!open) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [onClose, open]);

  if (!isMounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label={title}>
      <button
        type="button"
        aria-label={`Close ${title}`}
        className={cn(
          "absolute inset-0 bg-black/40 transition-opacity duration-200",
          isVisible ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />
      <section
        className={cn(
          "relative flex h-dvh w-full max-w-md flex-col bg-white shadow-xl transition-transform duration-200 ease-out",
          isVisible ? "translate-x-0" : "translate-x-full",
          className
        )}
      >
        <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <button
            type="button"
            aria-label={`Close ${title}`}
            onClick={onClose}
            className="rounded-md p-1 text-slate-600 hover:bg-slate-100 hover:text-primary"
          >
            <FiX size={22} />
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto p-5">{children}</div>
      </section>
    </div>,
    document.body
  );
}
