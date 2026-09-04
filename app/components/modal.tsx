"use client";

import { ReactNode } from "react";
import { FiX } from "react-icons/fi";
import { cn } from "@/lib/utils";
import { H2 } from "./typography";
import Button from "./button";

interface ModalProps {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  className?: string;
  bodyClassName?: string;
}

export function Modal({
  open,
  title,
  children,
  onClose,
  className,
  bodyClassName,
}: ModalProps) {
  if (!open) return null;
  const isProductModal = title === "Add Product" || title === "Edit Product";

  return (
    <div className="fixed px-4 overflow-auto py-5 inset-0 z-50 flex justify-center bg-black/40">
      <div
        className={cn(
          "m-auto w-full max-w-lg rounded-none bg-white px-4 py-5 shadow-xl",
          isProductModal &&
            "product-modal flex h-[min(820px,calc(100dvh-2.5rem))] max-w-5xl flex-col",
          className
        )}
      >
        <div className="flex shrink-0 items-center justify-between">
          <H2 className="text-lg font-bold">{title}</H2>

          <Button variant="unstyled" size="none"
            type="button"
            onClick={onClose}
            className="text-xl leading-none"
          >
            <FiX className="cursor-pointer" />
          </Button>
        </div>

        <div
          className={cn(
            "mt-4",
            isProductModal &&
              "product-modal-scrollbar min-h-0 flex-1 overflow-y-auto pr-3",
            bodyClassName
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
