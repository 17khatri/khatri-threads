import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface TypographyProps {
  children?: ReactNode;
  className?: string;
}

interface ParagraphProps extends TypographyProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

export function H1({ children, className }: TypographyProps) {
  return (
    <h1
      className={cn(
        "text-lg lg:text-xl xl:text-3xl font-bold tracking-tight leading-tight",
        className
      )}
    >
      {children}
    </h1>
  );
}

export function H2({ children, className }: TypographyProps) {
  return (
    <h2
      className={cn(
        "text-lg lg:text-lg xl:text-[22px] 2xl:text-2xl font-bold tracking-tight leading-tight",
        className
      )}
    >
      {children}
    </h2>
  );
}

export function H3({ children, className }: TypographyProps) {
  return (
    <h3
      className={cn(
        "text-base lg:text-base xl:text-lg font-semibold tracking-tight",
        className
      )}
    >
      {children}
    </h3>
  );
}

export function H4({ children, className }: TypographyProps) {
  return (
    <h4
      className={cn(
        "text-base lg:text-base xl:text-lg font-semibold",
        className
      )}
    >
      {children}
    </h4>
  );
}

export function H5({ children, className }: TypographyProps) {
  return <h5 className={cn("text-base font-medium", className)}>{children}</h5>;
}

export function H6({ children, className }: TypographyProps) {
  return <h6 className={cn("text-base font-medium", className)}>{children}</h6>;
}

const paragraphSizes = {
  xs: "text-xs leading-tight",
  sm: "text-sm leading-tight",
  md: "text-sm xl:text-base  leading-tight",
  lg: "text-base 2xl:text-lg leading-tight",
  xl: "text-xl leading-tight",
};

export function P({ children, size = "md", className }: ParagraphProps) {
  return (
    <p
      className={cn(
        paragraphSizes[size],
        "text-gray-500 font-normal",
        className
      )}
    >
      {children}
    </p>
  );
}
