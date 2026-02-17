import { Suspense } from "react";

import { SignInCard } from "@/components/trust-flow/sign-in-card";

type SignInPageProps = {
  searchParams: Promise<{ next?: string }>;
};

async function SignInContent({
  searchParams,
}: {
  searchParams: SignInPageProps["searchParams"];
}) {
  const params = await searchParams;
  const nextPath = params.next?.startsWith("/") ? params.next : "/dashboard";

  return <SignInCard nextPath={nextPath} />;
}

export default function SignInPage({ searchParams }: SignInPageProps) {
  return (
    <main className="mx-auto grid min-h-screen w-full max-w-6xl place-items-center px-4 py-10 sm:px-6 lg:px-8">
      <Suspense
        fallback={
          <div className="text-sm text-muted-foreground">
            Loading sign-in...
          </div>
        }
      >
        <SignInContent searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
