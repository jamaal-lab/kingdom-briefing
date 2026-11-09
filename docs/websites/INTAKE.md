# Intelligent Project Intake: how it works and how to connect it

## Flow

```
Browser (src/websites/intake/Intake.tsx)
  ├─ steps, branching and validation come from src/websites/intake/schema.ts
  ├─ draft kept in sessionStorage (this tab only; cleared on submit / "Start over" / tab close)
  └─ POST /websites/api/intake  { answers, consent, startedAt, company_fax }
Server (src/routes/api/intake.ts → src/server/intake.ts)
  ├─ INTAKE_DELIVERY not configured → 503 → page says "Nothing has been submitted" + Email/Copy my answers
  ├─ same-origin · JSON only · 48 KB cap · 4 per IP per 15 min · honeypot · ≥ 8 s fill time
  ├─ validateIntake(): the same schema again; hidden-branch answers dropped
  └─ adapter → 200 { ok, reference: "BTBS-YYYYMMDD-XXXXXX" }   (any failure → 502 → email fallback)
```

The success message appears **only** after the server confirms delivery and returns a reference.

## Branches (max 8 steps including review)

| Path | Chosen by | Steps |
|---|---|---|
| Quick job | "A quick website fix or update" | Project · Organization · What needs attention · Features · Scope · Review (6) |
| Existing site | "A redesign…", or "Not sure" + has a website | Project · Organization · What needs to change · Vision · Journey · Features · Scope · Review (8) |
| New site | New website, landing page, advanced experience, or "Not sure" + no website | same 8, with "What should the new website do?" |

The "Two ways we can help" buttons and each concept card's "Start with this direction" pre-fill the project type or inspiring concept. They never overwrite an answer the visitor already gave.

## Connecting a destination (owner decision; nothing is connected yet)

| Option | Set | Notes |
|---|---|---|
| **LeadConnector / GoHighLevel inbound webhook** (DemoDrop's CRM is a LeadConnector sub-account) | `INTAKE_DELIVERY=webhook`, `INTAKE_WEBHOOK_URL=<workflow inbound webhook URL>`, `INTAKE_WEBHOOK_SECRET` | Map `name`, `email`, `phone`, `organization`, `website`, `project_type` to contact fields and `summary` to a note. Keeps one system of record. **Recommended.** |
| Zapier / Make catch hook → email + CRM | same three variables | Good interim if the CRM isn't ready. |
| Small mail function (Resend/Postmark) | same | Email only; nothing is stored in a CRM. |

Payload (`content-type: application/json`, header `x-btbs-signature: sha256=<hex HMAC-SHA256 of the raw body>`):

```json
{ "type": "website_project_intake", "reference": "BTBS-20261109-A1B2C3", "received_at": "…", "source": "bridge2bettersolutions.com/websites",
  "path": "quick|existing|new", "name": "…", "email": "…", "phone": null, "organization": "…", "contact_method": "Email",
  "website": "…", "project_type": "…", "answers": { "...": "every answered question by id" }, "summary": "plain-text Q&A" }
```

Receivers should verify the signature where they can. LeadConnector inbound webhooks can't, so treat that URL itself as a secret. 2xx = delivered; anything else shows the visitor the email fallback.

**Interim process until a destination is approved:** leave `INTAKE_DELIVERY` unset. Visitors complete the intake, and at submit the page says plainly that online submission isn't on yet and offers **Email my answers** (pre-filled to jamaal@bridge2bettersolutions.com) and **Copy my answers**. Nothing is lost, and nothing pretends to be received.

## Privacy

- Never asks for passwords or credentials (help text on the systems question, consent note, privacy notice).
- Analytics events (`intake_start`, `intake_step`, `intake_submit`, `intake_complete`, `intake_fallback`, `intake_mailto`) carry step ids and path only. A test asserts that no name, email, organisation or free text appears in them.
- The `log` adapter writes counts and the email domain only.
- File uploads are **not** offered: there is no approved secure storage yet.
- `/websites/privacy` is a **draft** notice. Retention wording and the destination description need owner approval.

## DemoDrop as system of record

The connected DemoDrop account (`Bridge to Better Solutions, LLC`) has **no intake form defined** (`intake_id: null` on all 24 sites) and **no CRM connected** (it asks for a LeadConnector Location ID + Private Integration token). DemoDrop exposes no API for writing intake submissions, so it can't receive this intake directly today. Once the LeadConnector sub-account behind DemoDrop is connected, pointing `INTAKE_WEBHOOK_URL` at a LeadConnector inbound webhook puts these leads in the same CRM as DemoDrop's own form captures. That is one system of record, not a parallel one.

**Still needed for field parity:** DemoDrop's own client-intake questions (URL, screenshots or export). Until then the DemoDrop column in `01-AUDIT-AND-PLAN.md §5` stays marked pending rather than guessed.

## Changing questions or budget ranges

Edit `src/websites/intake/schema.ts` (questions/options/required/branching) or `src/websites/config.ts` (`SHOW_BUDGET_RANGES`, `BUDGET_RANGES`). Browser and server pick up the change together. Run `npx playwright test --project=unit --project=websites-desktop`.
