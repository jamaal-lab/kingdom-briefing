import { NextResponse } from "next/server";

const KINDS = ["visit", "prayer", "contact", "ministry", "grief"] as const;
type Kind = (typeof KINDS)[number];

const REQUIRED: Record<Kind, string[]> = {
  visit: ["firstName", "email", "date"],
  prayer: ["firstName", "request"],
  contact: ["name", "email", "message"],
  ministry: ["name", "email", "ministry"],
  grief: ["name", "phone"],
};

/**
 * STUB form endpoint. Validates and logs only.
 *
 * TODO(integration): route each kind to the church's systems:
 *  - visit / ministry  → ShelbyNext Membership (create person + add to connection group/process)
 *  - prayer / grief    → pastoral care inbox (email via Resend/Postmark) and/or ShelbyNext care notes
 *  - contact           → office inbox
 * Add rate limiting and a captcha (e.g. Cloudflare Turnstile) before launch.
 */
export async function POST(req: Request) {
  let body: { kind?: string; data?: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const kind = body.kind as Kind;
  const data = body.data ?? {};
  if (!KINDS.includes(kind)) return NextResponse.json({ error: "Unknown form." }, { status: 400 });

  // Honeypot: pretend success for bots.
  if (data.website) return NextResponse.json({ ok: true });

  const missing = REQUIRED[kind].filter((k) => !String(data[k] ?? "").trim());
  if (missing.length) return NextResponse.json({ error: "Please fill in all required fields." }, { status: 422 });

  const email = data.email ? String(data.email) : "";
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 422 });

  // Do not log prayer/grief content in production: it's pastoral and private.
  console.info(`[forms] received ${kind} submission`, kind === "prayer" || kind === "grief" ? "(content redacted)" : data);

  return NextResponse.json({ ok: true });
}
