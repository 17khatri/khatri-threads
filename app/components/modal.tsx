"use client";

import { ReactNode } from "react";
import { FiX } from "react-icons/fi";
import { H2 } from "./typography";

interface ModalProps {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}

export function Modal({ open, title, children, onClose }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed px-4 overflow-auto py-5 inset-0 z-50 flex justify-center bg-black/40">
      <div className="w-full max-w-lg h-fit rounded-xl bg-white shadow-xl px-4 py-5 m-auto">
        <div className="flex items-center justify-between">
          <H2 className="text-lg font-bold">{title}</H2>

          <button
            type="button"
            onClick={onClose}
            className="text-xl leading-none"
          >
            <FiX className="cursor-pointer" />
          </button>
        </div>

        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
