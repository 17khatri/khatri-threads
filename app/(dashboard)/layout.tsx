import { redirect } from "next/navigation";

import DashboardShell from "@/app/components/dashboard/dashboard-shell";
import ROUTES from "@/helper/routes";
import { getCurrentUser } from "@/lib/auth/auth";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  if (!user) {
    redirect(ROUTES.LOGIN);
  }

  return (
    <DashboardShell initialUser={user}>
      {children}
    </DashboardShell>
  );
}
