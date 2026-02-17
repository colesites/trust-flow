import { AlertTriangle, FileCheck2, Shield, Wallet } from "lucide-react";
import { cacheLife, cacheTag } from "next/cache";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  countClaimsByStatus,
  listClaims,
} from "@/domains/claims/claim.repository";
import {
  countQuotesByStatus,
  listQuotes,
} from "@/domains/distribution/quote.repository";
import { listKycSessions } from "@/domains/kyc/kyc.repository";
import {
  countUnderwritingByStatus,
  listUnderwritingCases,
} from "@/domains/underwriting/underwriting.repository";
import { resolveOrganizationId } from "@/lib/auth/organization";
import { requireServerSession } from "@/lib/auth/session";

type DashboardSnapshot = {
  claims: ReturnType<typeof countClaimsByStatus>;
  underwriting: ReturnType<typeof countUnderwritingByStatus>;
  quotes: ReturnType<typeof countQuotesByStatus>;
};

async function getDashboardSnapshot(
  organizationId: string,
): Promise<DashboardSnapshot> {
  "use cache: private";

  cacheLife("minutes");
  cacheTag(`dashboard:${organizationId}`);

  return {
    claims: countClaimsByStatus(organizationId),
    underwriting: countUnderwritingByStatus(organizationId),
    quotes: countQuotesByStatus(organizationId),
  };
}

export default async function DashboardPage() {
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

  const [snapshot, recentClaims, recentCases, recentQuotes, kycSessions] =
    await Promise.all([
      getDashboardSnapshot(organizationId),
      Promise.resolve(listClaims(organizationId, { limit: 5 })),
      Promise.resolve(listUnderwritingCases(organizationId, { limit: 5 })),
      Promise.resolve(listQuotes(organizationId, { limit: 5 })),
      Promise.resolve(listKycSessions(organizationId, 3)),
    ]);

  return (
    <div className="grid gap-6">
      <section className="grid gap-3">
        <Badge variant="success" className="w-fit">
          TrustFlow Dashboard
        </Badge>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Operations overview
        </h1>
        <p className="text-muted-foreground">
          Monitor claims, underwriting, and customer verification without
          context switching.
        </p>
      </section>

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

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck2 className="size-5 text-primary" />
              Recent claim activity
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {recentClaims.length > 0 ? (
              recentClaims.map((claim) => (
                <div
                  className="rounded-2xl border border-border bg-surface p-3"
                  key={claim.id}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-foreground">
                      {claim.claimType}
                    </p>
                    <Badge variant="neutral">{claim.status}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {claim.description.slice(0, 120)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No claims yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="size-5 text-primary" />
              KYC queue
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {kycSessions.length > 0 ? (
              kycSessions.map((sessionItem) => (
                <div
                  className="rounded-2xl border border-border bg-surface p-3"
                  key={sessionItem.id}
                >
                  <p className="font-medium text-foreground">
                    {sessionItem.documentType}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Provider: {sessionItem.provider}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No active verification sessions.
              </p>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-primary" />
              Underwriting cases
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {recentCases.length > 0 ? (
              recentCases.map((caseItem) => (
                <div
                  className="rounded-2xl border border-border bg-surface p-3"
                  key={caseItem.id}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-foreground">
                      {caseItem.productCode}
                    </p>
                    <Badge variant="neutral">{caseItem.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Risk score: {caseItem.riskScore}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No underwriting cases yet.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="size-5 text-primary" />
              Distribution quotes
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {recentQuotes.length > 0 ? (
              recentQuotes.map((quote) => (
                <div
                  className="rounded-2xl border border-border bg-surface p-3"
                  key={quote.id}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-foreground">
                      {quote.productCode}
                    </p>
                    <Badge variant="neutral">{quote.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    ${(quote.premiumCents / 100).toFixed(2)} {quote.currency}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No quotes yet.</p>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="flex flex-wrap items-center gap-4 text-sm">
        <Link
          className="font-medium text-primary hover:underline"
          href="/api/v1/claims"
        >
          API: Claims
        </Link>
        <Link
          className="font-medium text-primary hover:underline"
          href="/api/v1/underwriting/cases"
        >
          API: Underwriting
        </Link>
        <Link
          className="font-medium text-primary hover:underline"
          href="/api/v1/distribution/quotes"
        >
          API: Distribution
        </Link>
      </section>
    </div>
  );
}
