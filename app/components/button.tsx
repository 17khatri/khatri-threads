import Link from "next/link";
import React from "react";
import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  href?: string;
}

const variantStyles = {
  primary: "bg-primary text-white hover:bg-primary-light",
  secondary: "bg-secondary",
  outline:
    "border text-black border-gray-300 hover:bg-primary/10 hover:text-primary hover:border-primary",
  danger: "bg-danger text-white hover:opacity-90",
};

const sizeStyles = {
  sm: "py-1.5 px-3 text-sm",
  md: "py-2 px-5 text-sm lg:text-base",
  lg: "py-2 lg:py-3 px-6 text-sm lg:text-base",
};

export default function Button({
  children,
  variant = "primary",
  size = "lg",
  className,
  disabled,
  href,
  ...props
}: ButtonProps) {
  const classes = clsx(
    "inline-flex cursor-pointer gap-2 items-center justify-center rounded-full font-medium transition-all duration-300",
    "focus:outline-none",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    variantStyles[variant],
    sizeStyles[size],
    className
  );

  if (href) {
    return (
      <Link href={href} className={`${classes}`}>
        {children}
      </Link>
    );
  }

  return (
    <button disabled={disabled} className={`${classes}`} {...props}>
      {children}
    </button>
  );
}
