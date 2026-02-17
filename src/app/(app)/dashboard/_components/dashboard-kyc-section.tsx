import { Shield } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getRecentKycSessions } from "../_lib/dashboard-data";
import type { DashboardSectionProps } from "./dashboard-types";

export function DashboardKycFallback() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="size-5 text-primary" />
          KYC queue
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        {["a", "b"].map((id) => (
          <div
            className="h-16 animate-pulse rounded-2xl border border-border bg-muted"
            key={`kyc-skeleton-${id}`}
          />
        ))}
      </CardContent>
    </Card>
  );
}

export async function DashboardKycSection({
  organizationId,
}: DashboardSectionProps) {
  const kycSessions = await getRecentKycSessions(organizationId);

  return (
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
  );
}
