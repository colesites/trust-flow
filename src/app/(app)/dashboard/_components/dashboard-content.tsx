import { Suspense } from "react";

import { resolveOrganizationId } from "@/lib/auth/organization";
import { requireServerSession } from "@/lib/auth/session";

import {
  DashboardClaimsFallback,
  DashboardClaimsSection,
} from "./dashboard-claims-section";
import { DashboardIntro } from "./dashboard-intro";
import {
  DashboardKycFallback,
  DashboardKycSection,
} from "./dashboard-kyc-section";
import { DashboardLinks } from "./dashboard-links";
import {
  DashboardQuotesFallback,
  DashboardQuotesSection,
} from "./dashboard-quotes-section";
import {
  DashboardStatsFallback,
  DashboardStatsSection,
} from "./dashboard-stats-section";
import {
  DashboardUnderwritingFallback,
  DashboardUnderwritingSection,
} from "./dashboard-underwriting-section";

export async function DashboardPageContent() {
  const session = await requireServerSession("/dashboard");
  const userRecord = session.user as Record<string, unknown>;
  const rawOrganizationId =
    typeof userRecord.activeOrganizationId === "string"
      ? userRecord.activeOrganizationId
      : null;
  const organizationId = resolveOrganizationId(
    rawOrganizationId,
    session.user.id,
  );

  return (
    <div className="grid gap-6">
      <DashboardIntro />
      <Suspense fallback={<DashboardStatsFallback />}>
        <DashboardStatsSection organizationId={organizationId} />
      </Suspense>
      <section className="grid gap-4 lg:grid-cols-3">
        <Suspense fallback={<DashboardClaimsFallback />}>
          <DashboardClaimsSection organizationId={organizationId} />
        </Suspense>
        <Suspense fallback={<DashboardKycFallback />}>
          <DashboardKycSection organizationId={organizationId} />
        </Suspense>
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        <Suspense fallback={<DashboardUnderwritingFallback />}>
          <DashboardUnderwritingSection organizationId={organizationId} />
        </Suspense>
        <Suspense fallback={<DashboardQuotesFallback />}>
          <DashboardQuotesSection organizationId={organizationId} />
        </Suspense>
      </section>
      <DashboardLinks />
    </div>
  );
}
