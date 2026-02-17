import { Suspense } from "react";

import { SignUpCard } from "@/components/trust-flow/sign-up-card";

type SignUpPageProps = {
  searchParams: Promise<{ next?: string }>;
};

async function SignUpContent({
  searchParams,
}: {
  searchParams: SignUpPageProps["searchParams"];
}) {
  const params = await searchParams;
  const nextPath = params.next?.startsWith("/") ? params.next : "/dashboard";

  return <SignUpCard nextPath={nextPath} />;
}

export default function SignUpPage({ searchParams }: SignUpPageProps) {
  return (
    <main className="mx-auto grid min-h-screen w-full max-w-6xl place-items-center px-4 py-10 sm:px-6 lg:px-8">
      <Suspense
        fallback={
          <div className="text-sm text-muted-foreground">
            Loading sign-up...
          </div>
        }
      >
        <SignUpContent searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
