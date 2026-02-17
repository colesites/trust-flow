import { Badge } from "@/components/ui/badge";

export function DashboardIntro() {
  return (
    <section className="grid gap-3">
      <Badge variant="success" className="w-fit">
        TrustFlow Dashboard
      </Badge>
      <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        Operations overview
      </h1>
      <p className="text-muted-foreground">
        Monitor claims, underwriting, and customer verification without context
        switching.
      </p>
    </section>
  );
}
