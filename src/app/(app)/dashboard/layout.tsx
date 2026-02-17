import { type ReactNode, Suspense } from "react";

import { DashboardHeader } from "@/components/trust-flow/dashboard-header";
import { requireServerSession } from "@/lib/auth/session";

type DashboardLayoutProps = {
  children: ReactNode;
};

function DashboardLayoutFallback({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-surface to-white">
      <div className="border-b border-border bg-white/80 px-4 py-3 sm:px-6 lg:px-8">
        <div className="h-6 w-64 animate-pulse rounded bg-muted" />
      </div>
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}

async function DashboardLayoutContent({ children }: DashboardLayoutProps) {
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

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <Suspense
      fallback={<DashboardLayoutFallback>{children}</DashboardLayoutFallback>}
    >
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </Suspense>
  );
}
