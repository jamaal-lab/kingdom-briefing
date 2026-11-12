"use client";

import { useId, useState, type ReactNode } from "react";
import { Button } from "./ui";

export type Field = {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "date" | "textarea" | "select" | "checkbox" | "number";
  required?: boolean;
  options?: string[];
  autoComplete?: string;
  hint?: string;
  half?: boolean;
};

/**
 * Accessible form that posts JSON to /api/forms (stub).
 * Labels are always visible; errors are announced via role="alert".
 */
export function Form({
  kind,
  fields,
  submitLabel,
  success,
  hidden,
}: {
  kind: "visit" | "prayer" | "contact" | "ministry" | "grief";
  fields: Field[];
  submitLabel: string;
  success: ReactNode;
  hidden?: Record<string, string>;
}) {
  const uid = useId();
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: Record<string, unknown> = { ...hidden };
    for (const f of fields) data[f.name] = f.type === "checkbox" ? fd.get(f.name) === "on" : fd.get(f.name);
    data.website = fd.get("website"); // honeypot
    setState("sending");
    try {
      const res = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, data }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Something went wrong.");
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div role="status" className="rounded-2xl border border-brand-bright/40 bg-brand/15 p-6 text-lg">
        {success}
      </div>
    );
  }

  const input =
    "mt-2 block w-full rounded-xl border border-line bg-ink/60 px-4 py-3 text-base text-foam placeholder:text-tide/60 focus:border-brand-bright focus:outline-none focus-visible:outline-2";

  return (
    <form onSubmit={onSubmit} noValidate={false} className="grid gap-5 sm:grid-cols-2">
      {fields.map((f) => {
        const id = `${uid}-${f.name}`;
        const span = f.half ? "" : "sm:col-span-2";
        if (f.type === "checkbox")
          return (
            <label key={f.name} htmlFor={id} className={`flex items-start gap-3 text-foam/90 ${span}`}>
              <input id={id} name={f.name} type="checkbox" className="mt-1 h-5 w-5 accent-[var(--brand-bright)]" />
              <span>{f.label}</span>
            </label>
          );
        return (
          <div key={f.name} className={span}>
            <label htmlFor={id} className="text-sm font-medium text-foam">
              {f.label}
              {f.required && <span className="text-brass"> *</span>}
            </label>
            {f.type === "textarea" ? (
              <textarea id={id} name={f.name} required={f.required} rows={5} className={input} />
            ) : f.type === "select" ? (
              <select id={id} name={f.name} required={f.required} className={input} defaultValue="">
                <option value="" disabled>
                  Choose one
                </option>
                {f.options?.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            ) : (
              <input
                id={id}
                name={f.name}
                type={f.type ?? "text"}
                required={f.required}
                autoComplete={f.autoComplete}
                min={f.type === "number" ? 0 : undefined}
                aria-describedby={f.hint ? `${id}-hint` : undefined}
                className={input}
              />
            )}
            {f.hint && (
              <p id={`${id}-hint`} className="mt-1 text-sm text-tide">
                {f.hint}
              </p>
            )}
          </div>
        );
      })}
      {/* honeypot */}
      <div className="hidden" aria-hidden="true">
        <label>
          Website <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {state === "error" && (
        <p role="alert" className="text-[#ff9a9a] sm:col-span-2">
          {error}
        </p>
      )}
      <div className="sm:col-span-2">
        <Button type="submit" disabled={state === "sending"}>
          {state === "sending" ? "Sending…" : submitLabel}
        </Button>
        <p className="mt-3 text-sm text-tide">
          <span className="text-brass">*</span> Required. We keep your information private.
        </p>
      </div>
    </form>
  );
}
