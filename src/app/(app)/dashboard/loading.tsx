export default function DashboardLoading() {
  const skeletonIds = ["a", "b", "c", "d"] as const;

  return (
    <div className="grid gap-4">
      <div className="h-8 w-56 animate-pulse rounded-xl bg-muted" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {skeletonIds.map((id) => (
          <div
            className="h-32 animate-pulse rounded-3xl border border-border bg-muted"
            key={`skeleton-card-${id}`}
          />
        ))}
      </div>
    </div>
  );
}
