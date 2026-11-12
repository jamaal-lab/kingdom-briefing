# Fellowship Chicago (The Ship): Website

Demo rebuild of fellowshipchicago.com for church review. **noindex until approved.**

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

Deploys to Vercel with zero config. Env: `DEMO_NOINDEX=false` at launch.

## Editing content
All copy lives in typed files under `/content`. No component changes needed:

| File | What |
|---|---|
| `content/site.ts` | address, phone, service times, giving, social, YouTube |
| `content/story.ts` | timeline, leadership, T.H.E. S.H.I.P., logo meaning |
| `content/ministries.ts` | ministry finder + one page per ministry |
| `content/events.ts` | special events (text cards) |
| `content/sermons.ts` | series/scripture tags for YouTube videos, music playlists |
| `content/care.ts` | crisis resources |

Photos go in `/public` and are referenced from those files.

## Routes
`/` · `/im-new` · `/watch` · `/connect` · `/connect/[slug]` · `/our-story` · `/give` · `/events` · `/care` ·
`/contact` · `/design` (internal style guide) · `/api/forms` (stub)

See **NOTES.md** for every TODO and assumption, and `/docs` for the content inventory and design direction.
