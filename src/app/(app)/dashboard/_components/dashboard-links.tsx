import Link from "next/link";

export function DashboardLinks() {
  return (
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
  );
}
