# First-party inquiry architecture

**Status:** built and tested, **disabled by default, no external system connected.** The email (`mailto:`) consultation action remains the primary path and always works, whatever these settings are.

## Flow

```
Consultation composer (browser)
  ├─ "Open in your email app"  → mailto:jamaal@bridge2bettersolutions.com   (always on)
  └─ InquiryForm (only if built with VITE_INQUIRY_FORM=1)
        POST /api/inquiry  JSON
          1. INQUIRY_ENABLED=1?                     else 404
          2. delivery adapter configured?           else 503
          3. same-origin (Origin/Referer = Host)    else 403
          4. JSON content type, ≤ 8 KB              else 415 / 413
          5. rate limit: 5 per 10 min per client IP else 429
          6. validate (server/inquiry.ts)           else 422 + field errors
               - name 2–120 chars, email format, enumerated project/tier/timing
               - control characters stripped, lengths capped
               - honeypot field must be empty, form shown ≥ 3 s
          7. deliver(adapter) → reference BW-YYYYMMDD-XXXXXX
          8. 200 { ok, reference }  — or 502 with "please email us instead"
```

On any failure the form tells the visitor to use email, so no inquiry is silently lost.

## Data handling

- Nothing is written to disk or a database by this code.
- The only adapter (`log`) writes one redacted line: reference, project, tier, timing, message length and **email domain only**. No name, address or message text.
- No cookies; no third-party scripts.

## Connecting real delivery (needs approval)

Add an adapter to `ADAPTERS` in `src/server/inquiry.ts` and select it with `INQUIRY_DELIVERY`. Recommended options, simplest first:

1. **Transactional email** (Postmark, Resend, Amazon SES): send the inquiry to jamaal@bridge2bettersolutions.com with `reply-to` = the visitor. API key in the host's secret store (`INQUIRY_EMAIL_API_KEY`), read inside the adapter only. Add the API host to nothing on the client — it is server-to-server.
2. **CRM** (HubSpot, Pipedrive, etc.): create a contact + deal via the vendor API. Requires a data-processing review and a privacy-policy update.

Before enabling in production:

- [ ] Privacy notice describing what is collected and why (add a link under the form).
- [ ] Choose the adapter; store its secret outside Git.
- [ ] Replace the in-memory rate limiter with a shared store if more than one server instance runs (Vercel functions and other serverless platforms run many).
- [ ] Optional: a privacy-friendly CAPTCHA (e.g. Cloudflare Turnstile) if spam gets past the honeypot + timing + rate limit. That requires a CSP change.
- [ ] Decide on a retention policy at the destination (inbox/CRM).
