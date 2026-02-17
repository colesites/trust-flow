import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  getDashboardSnapshot,
  getRecentKycSessions,
} from "../_lib/dashboard-data";
import type { DashboardSectionProps } from "./dashboard-types";

export function DashboardStatsFallback() {
  const skeletonIds = ["claims", "underwriting", "quotes", "kyc"] as const;

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {skeletonIds.map((id) => (
        <Card key={`stats-skeleton-${id}`}>
          <CardHeader>
            <div className="h-4 w-32 animate-pulse rounded bg-muted" />
            <div className="h-7 w-16 animate-pulse rounded bg-muted" />
          </CardHeader>
          <CardContent>
            <div className="h-4 w-40 animate-pulse rounded bg-muted" />
          </CardContent>
        </Card>
      ))}
    </section>
  );
}

export async function DashboardStatsSection({
  organizationId,
}: DashboardSectionProps) {
  const [snapshot, kycSessions] = await Promise.all([
    getDashboardSnapshot(organizationId),
    getRecentKycSessions(organizationId),
  ]);

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Card>
        <CardHeader>
          <CardDescription>Claims submitted</CardDescription>
          <CardTitle>{snapshot.claims.submitted}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          {snapshot.claims.validating} currently validating.
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>Underwriting in pricing</CardDescription>
          <CardTitle>{snapshot.underwriting.pricing}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          {snapshot.underwriting.referred} referred for manual review.
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>Quotes presented</CardDescription>
          <CardTitle>{snapshot.quotes.presented}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          {snapshot.quotes.accepted} accepted this cycle.
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>KYC sessions active</CardDescription>
          <CardTitle>{kycSessions.length}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Verification windows stay open for 30 minutes.
        </CardContent>
      </Card>
    </section>
  );
}
