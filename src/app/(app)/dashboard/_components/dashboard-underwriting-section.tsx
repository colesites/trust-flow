import { AlertTriangle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getRecentUnderwritingCases } from "../_lib/dashboard-data";
import type { DashboardSectionProps } from "./dashboard-types";

export function DashboardUnderwritingFallback() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="size-5 text-primary" />
          Underwriting cases
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        {["a", "b", "c"].map((id) => (
          <div
            className="h-16 animate-pulse rounded-2xl border border-border bg-muted"
            key={`underwriting-skeleton-${id}`}
          />
        ))}
      </CardContent>
    </Card>
  );
}

export async function DashboardUnderwritingSection({
  organizationId,
}: DashboardSectionProps) {
  const recentCases = await getRecentUnderwritingCases(organizationId);

  return (
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
  );
}
