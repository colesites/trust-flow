"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth/client";

type SignInCardProps = {
  nextPath: string;
};

export function SignInCard({ nextPath }: SignInCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    startTransition(async () => {
      let result: Awaited<ReturnType<typeof authClient.signIn.email>>;

      try {
        result = await authClient.signIn.email({
          email,
          password,
        });
      } catch {
        setErrorMessage(
          "Unable to reach the authentication service. Check that the app is running on this same origin and try again.",
        );
        return;
      }

      if (result.error) {
        setErrorMessage(
          result.error.message ?? "Unable to sign in with these credentials.",
        );
        return;
      }

      router.push(nextPath);
      router.refresh();
    });
  }

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign in to TrustFlow</CardTitle>
        <CardDescription>
          Access claim tracking, underwriting decisions, and your distribution
          dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-1.5">
            <label className="text-sm font-medium" htmlFor="email">
              Email
            </label>
            <input
              autoComplete="email"
              className="h-11 rounded-2xl border border-border bg-white px-3 text-sm outline-none ring-primary/40 transition focus:ring-2"
              id="email"
              onChange={(event) => setEmail(event.currentTarget.value)}
              required
              type="email"
              value={email}
            />
          </div>
          <div className="grid gap-1.5">
            <label className="text-sm font-medium" htmlFor="password">
              Password
            </label>
            <input
              autoComplete="current-password"
              className="h-11 rounded-2xl border border-border bg-white px-3 text-sm outline-none ring-primary/40 transition focus:ring-2"
              id="password"
              onChange={(event) => setPassword(event.currentTarget.value)}
              required
              type="password"
              value={password}
            />
          </div>

          {errorMessage ? (
            <p className="rounded-xl border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {errorMessage}
            </p>
          ) : null}

          <Button disabled={isPending} size="lg" type="submit">
            {isPending ? "Signing in..." : "Sign in"}
          </Button>

          <p className="text-sm text-muted-foreground">
            New to TrustFlow?{" "}
            <Link
              className="font-medium text-primary hover:underline"
              href={`/sign-up?next=${encodeURIComponent(nextPath)}`}
            >
              Create an account
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
