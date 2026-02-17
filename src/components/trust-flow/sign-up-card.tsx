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

type SignUpCardProps = {
  nextPath: string;
};

export function SignUpCard({ nextPath }: SignUpCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    startTransition(async () => {
      let result: Awaited<ReturnType<typeof authClient.signUp.email>>;

      try {
        result = await authClient.signUp.email({
          name,
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
          result.error.message ?? "Unable to create your account.",
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
        <CardTitle>Create your TrustFlow account</CardTitle>
        <CardDescription>
          You can submit claims, verify identity, and track policy journeys from
          one dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-1.5">
            <label className="text-sm font-medium" htmlFor="name">
              Full name
            </label>
            <input
              autoComplete="name"
              className="h-11 rounded-2xl border border-border bg-white px-3 text-sm outline-none ring-primary/40 transition focus:ring-2"
              id="name"
              onChange={(event) => setName(event.currentTarget.value)}
              required
              value={name}
            />
          </div>
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
              autoComplete="new-password"
              className="h-11 rounded-2xl border border-border bg-white px-3 text-sm outline-none ring-primary/40 transition focus:ring-2"
              id="password"
              minLength={8}
              onChange={(event) => setPassword(event.currentTarget.value)}
              required
              type="password"
              value={password}
            />
            <p className="text-xs text-muted-foreground">
              Use at least 8 characters. We hash credentials server-side.
            </p>
          </div>

          {errorMessage ? (
            <p className="rounded-xl border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {errorMessage}
            </p>
          ) : null}

          <Button disabled={isPending} size="lg" type="submit">
            {isPending ? "Creating account..." : "Create account"}
          </Button>

          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              className="font-medium text-primary hover:underline"
              href={`/sign-in?next=${encodeURIComponent(nextPath)}`}
            >
              Sign in
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
