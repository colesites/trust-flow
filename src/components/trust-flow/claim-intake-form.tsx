"use client";

import { type FormEvent, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";

type FormState = {
  policyId: string;
  claimType:
    | "collision"
    | "weather"
    | "theft"
    | "liability"
    | "property_damage"
    | "medical";
  incidentDate: string;
  description: string;
};

const initialFormState: FormState = {
  policyId: "",
  claimType: "collision",
  incidentDate: "",
  description: "",
};

export function ClaimIntakeForm() {
  const [isPending, startTransition] = useTransition();
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [resultMessage, setResultMessage] = useState<string>("");

  function updateField<K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) {
    setFormState((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResultMessage("");

    startTransition(async () => {
      const response = await fetch("/api/v1/claims", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(formState),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok || !payload?.ok) {
        if (response.status === 401) {
          setResultMessage(
            "Sign in first to submit a claim and start timeline tracking.",
          );
          return;
        }
        setResultMessage(
          payload?.error?.message ??
            "We could not submit your claim right now. Please try again.",
        );
        return;
      }

      setResultMessage(
        `Claim ${payload.data.id} submitted and queued for validation.`,
      );
      setFormState(initialFormState);
    });
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-1.5">
        <label className="text-sm font-medium" htmlFor="policyId">
          Policy ID
        </label>
        <input
          className="h-11 rounded-2xl border border-border bg-white px-3 text-sm outline-none ring-primary/40 transition focus:ring-2"
          id="policyId"
          onChange={(event) =>
            updateField("policyId", event.currentTarget.value)
          }
          placeholder="TF-POL-2026-001"
          required
          value={formState.policyId}
        />
      </div>

      <div className="grid gap-1.5 sm:grid-cols-2 sm:gap-4">
        <div className="grid gap-1.5">
          <label className="text-sm font-medium" htmlFor="claimType">
            Claim type
          </label>
          <select
            className="h-11 rounded-2xl border border-border bg-white px-3 text-sm outline-none ring-primary/40 transition focus:ring-2"
            id="claimType"
            onChange={(event) =>
              updateField(
                "claimType",
                event.currentTarget.value as FormState["claimType"],
              )
            }
            value={formState.claimType}
          >
            <option value="collision">Collision</option>
            <option value="weather">Weather</option>
            <option value="theft">Theft</option>
            <option value="liability">Liability</option>
            <option value="property_damage">Property damage</option>
            <option value="medical">Medical</option>
          </select>
        </div>

        <div className="grid gap-1.5">
          <label className="text-sm font-medium" htmlFor="incidentDate">
            Incident date
          </label>
          <input
            className="h-11 rounded-2xl border border-border bg-white px-3 text-sm outline-none ring-primary/40 transition focus:ring-2"
            id="incidentDate"
            onChange={(event) =>
              updateField("incidentDate", event.currentTarget.value)
            }
            required
            type="date"
            value={formState.incidentDate}
          />
        </div>
      </div>

      <div className="grid gap-1.5">
        <label className="text-sm font-medium" htmlFor="description">
          What happened?
        </label>
        <textarea
          className="min-h-32 rounded-2xl border border-border bg-white px-3 py-2.5 text-sm leading-relaxed outline-none ring-primary/40 transition focus:ring-2"
          id="description"
          onChange={(event) =>
            updateField("description", event.currentTarget.value)
          }
          placeholder="Describe the event, location, and any visible damage."
          required
          value={formState.description}
        />
        <p className="text-xs text-muted-foreground">
          Why we ask this: it helps us route your claim to the correct adjuster
          faster.
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Button disabled={isPending} size="lg" type="submit" variant="primary">
          {isPending ? "Submitting..." : "Submit claim"}
        </Button>
        <output className="text-sm text-muted-foreground" aria-live="polite">
          {resultMessage ||
            "Your claim timeline updates instantly once accepted."}
        </output>
      </div>
    </form>
  );
}
