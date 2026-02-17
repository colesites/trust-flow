"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/client";

type DashboardHeaderProps = {
  name: string;
  email: string;
};

export function DashboardHeader({ name, email }: DashboardHeaderProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSignOut() {
    startTransition(async () => {
      await authClient.signOut();
      router.push("/");
      router.refresh();
    });
  }

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div>
          <p className="text-sm text-muted-foreground">Signed in as {email}</p>
          <p className="font-medium text-foreground">Welcome back, {name}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            className="text-sm font-medium text-primary hover:underline"
            href="/"
          >
            Landing
          </Link>
          <Button
            disabled={isPending}
            onClick={handleSignOut}
            size="sm"
            variant="secondary"
          >
            {isPending ? "Signing out..." : "Sign out"}
          </Button>
        </div>
      </div>
    </header>
  );
}
