import { Suspense } from "react";

import { DashboardPageContent } from "./_components/dashboard-content";
import DashboardLoading from "./loading";

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardPageContent />
    </Suspense>
  );
}
