import {
  Activity,
  ArrowRight,
  BadgeCheck,
  LogIn,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";
import { cacheLife, cacheTag } from "next/cache";
import Link from "next/link";

import { ClaimIntakeForm } from "@/components/trust-flow/claim-intake-form";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type SnapshotMetric = {
  id: string;
  label: string;
  value: string;
  change: string;
};

type TimelineStep = {
  title: string;
  detail: string;
  status: "done" | "current" | "upcoming";
};

async function getJourneySnapshot() {
  "use cache";

  cacheLife("minutes");
  cacheTag("trustflow-home");

  const metrics: SnapshotMetric[] = [
    {
      id: "m1",
      label: "Claims validated < 5 mins",
      value: "92%",
      change: "+8%",
    },
    {
      id: "m2",
      label: "Underwriting decisions today",
      value: "148",
      change: "+12",
    },
    {
      id: "m3",
      label: "Customer CSAT",
      value: "4.8/5",
      change: "+0.2",
    },
  ];

  const timeline: TimelineStep[] = [
    {
      title: "Submit and validate",
      detail: "Structured intake and policy checks start instantly.",
      status: "done",
    },
    {
      title: "Review and communicate",
      detail: "Adjusters receive context, documents, and next best actions.",
      status: "current",
    },
    {
      title: "Approve and payout",
      detail: "Once approved, payout orchestration runs with audit logging.",
      status: "upcoming",
    },
  ];

  return { metrics, timeline };
}

export default async function Home() {
  const snapshot = await getJourneySnapshot();

  return (
    <main className="relative overflow-hidden bg-gradient-to-b from-white via-surface to-white pb-20">
      <div className="pointer-events-none absolute inset-x-0 top-[-18rem] h-[32rem] bg-[radial-gradient(circle_at_top,rgba(40,167,69,0.26),transparent_65%)]" />
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 pt-10 sm:px-6 lg:px-8">
        <section className="grid gap-7 rounded-4xl border border-border bg-white/85 p-7 shadow-[0_40px_90px_-65px_rgba(7,94,53,0.48)] backdrop-blur-sm sm:p-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Badge variant="success">TrustFlow Insurance Platform</Badge>
            <p className="text-sm text-muted-foreground">
              Customer experience first
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="grid gap-4">
              <h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                Claims, underwriting, and distribution in one calm operational
                flow.
              </h1>
              <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                TrustFlow gives customers a transparent claim timeline while
                teams get secure, role-aware workflows with AI-assisted clarity.
              </p>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <a
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 font-medium text-primary-foreground transition hover:bg-primary-strong"
                  href="#claim-intake"
                >
                  Start claim intake
                  <ArrowRight className="size-4" />
                </a>
                <Link
                  className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 font-medium text-primary transition hover:border-primary/50 hover:bg-surface"
                  href="/dashboard"
                >
                  Open dashboard
                  <LogIn className="size-4" />
                </Link>
                <span className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-muted-foreground">
                  <ShieldCheck className="size-4 text-primary" />
                  Secure by default
                </span>
              </div>
            </div>

            <div className="grid gap-4 rounded-3xl border border-border bg-white p-4 sm:p-5">
              {snapshot.metrics.map((metric) => (
                <div
                  className="flex items-center justify-between"
                  key={metric.id}
                >
                  <p className="text-sm text-muted-foreground">
                    {metric.label}
                  </p>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-foreground">
                      {metric.value}
                    </p>
                    <p className="text-xs font-medium text-primary">
                      {metric.change}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="appear-up">
            <CardHeader>
              <div className="inline-flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <BadgeCheck className="size-5" />
              </div>
              <CardTitle>Customer Claim Journey</CardTitle>
              <CardDescription>
                Submit, validate, track, communicate, and payout with full
                visibility.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="appear-up [animation-delay:100ms]">
            <CardHeader>
              <div className="inline-flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Activity className="size-5" />
              </div>
              <CardTitle>Underwriting Journey</CardTitle>
              <CardDescription>
                Intake to decision with explicit risk signals and explainable
                factors.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="appear-up [animation-delay:180ms] sm:col-span-2 lg:col-span-1">
            <CardHeader>
              <div className="inline-flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Wallet className="size-5" />
              </div>
              <CardTitle>Distribution Journey</CardTitle>
              <CardDescription>
                Guided product discovery, quote, purchase, and renewal
                orchestration.
              </CardDescription>
            </CardHeader>
          </Card>
        </section>

        <section
          className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]"
          id="claim-intake"
        >
          <Card className="appear-up [animation-delay:220ms]">
            <CardHeader>
              <Badge variant="neutral" className="w-fit">
                Live claim intake
              </Badge>
              <CardTitle>Start a claim in under two minutes</CardTitle>
              <CardDescription>
                Inline validation, transparent progress, and fast triage by
                default.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ClaimIntakeForm />
            </CardContent>
          </Card>

          <Card className="appear-up [animation-delay:260ms]">
            <CardHeader>
              <Badge variant="neutral" className="w-fit">
                Timeline
              </Badge>
              <CardTitle>Current customer claim flow</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              {snapshot.timeline.map((step) => (
                <div
                  className="rounded-2xl border border-border bg-surface p-4"
                  key={step.title}
                >
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <p className="font-medium text-foreground">{step.title}</p>
                    <span
                      className={[
                        "rounded-full px-2 py-0.5 text-xs font-semibold uppercase tracking-wide",
                        step.status === "done"
                          ? "bg-primary/15 text-primary-deep"
                          : step.status === "current"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-muted text-muted-foreground",
                      ].join(" ")}
                    >
                      {step.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{step.detail}</p>
                </div>
              ))}
              <div className="flex items-start gap-2 rounded-2xl border border-dashed border-primary/35 bg-primary/5 p-4 text-sm text-primary-deep">
                <Sparkles className="mt-0.5 size-4" />
                <p>
                  Next best action prompts are generated through
                  `/api/ai/claim-intake` with structured outputs and redacted
                  audit previews.
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                Claim submission requires account authentication.{" "}
                <Link
                  className="font-medium text-primary hover:underline"
                  href="/sign-in"
                >
                  Sign in to continue
                </Link>
                .
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
