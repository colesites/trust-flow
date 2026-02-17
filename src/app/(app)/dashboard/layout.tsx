import type { ReactNode } from "react";

import { DashboardHeader } from "@/components/trust-flow/dashboard-header";
import { requireServerSession } from "@/lib/auth/session";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await requireServerSession("/dashboard");

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-surface to-white">
      <DashboardHeader name={session.user.name} email={session.user.email} />
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}
