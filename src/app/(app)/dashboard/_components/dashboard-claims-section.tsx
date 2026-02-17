import { FileCheck2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getRecentClaims } from "../_lib/dashboard-data";
import type { DashboardSectionProps } from "./dashboard-types";

export function DashboardClaimsFallback() {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileCheck2 className="size-5 text-primary" />
          Recent claim activity
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        {["a", "b", "c"].map((id) => (
          <div
            className="h-20 animate-pulse rounded-2xl border border-border bg-muted"
            key={`claim-skeleton-${id}`}
          />
        ))}
      </CardContent>
    </Card>
  );
}

export async function DashboardClaimsSection({
  organizationId,
}: DashboardSectionProps) {
  const recentClaims = await getRecentClaims(organizationId);

  return (
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
                <p className="font-medium text-foreground">{claim.claimType}</p>
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
  );
}
