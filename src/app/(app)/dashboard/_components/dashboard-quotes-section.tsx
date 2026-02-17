import { Wallet } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getRecentQuotes } from "../_lib/dashboard-data";
import type { DashboardSectionProps } from "./dashboard-types";

export function DashboardQuotesFallback() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="size-5 text-primary" />
          Distribution quotes
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        {["a", "b", "c"].map((id) => (
          <div
            className="h-16 animate-pulse rounded-2xl border border-border bg-muted"
            key={`quote-skeleton-${id}`}
          />
        ))}
      </CardContent>
    </Card>
  );
}

export async function DashboardQuotesSection({
  organizationId,
}: DashboardSectionProps) {
  const recentQuotes = await getRecentQuotes(organizationId);

  return (
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
  );
}
