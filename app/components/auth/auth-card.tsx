import type { ReactNode } from "react";
import { H1, P } from "@/app/components/typography";

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div className="max-w-6xl overflow-hidden rounded-3xl bg-panel shadow-2xl">
      <section className="flex items-center justify-center p-5 sm:p-8 lg:p-10">
        <div className="w-full max-w-xl">
          <div className="mb-8 text-center">
            <H1>{title}</H1>
            <P className="mt-2 text-muted">{subtitle}</P>
          </div>

          {children}
        </div>
      </section>
    </div>
  );
}
