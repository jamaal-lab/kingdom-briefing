import { youtube } from "@/content/site";
import { sermonMeta } from "@/content/sermons";
import type { Sermon } from "@/content/types";

const BOOKS =
  "Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|[12] ?Samuel|[12] ?Kings|[12] ?Chronicles|Ezra|Nehemiah|Esther|Job|Psalms?|Proverbs|Ecclesiastes|Song of Solomon|Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi|Matthew|Mark|Luke|John|Acts|Romans|[12] ?Corinthians|Galatians|Ephesians|Philippians|Colossians|[12] ?Thessalonians|[12] ?Timothy|Titus|Philemon|Hebrews|James|[12] ?Peter|[123] ?John|Jude|Revelation";
const SCRIPTURE_RE = new RegExp(`\\b(${BOOKS})\\s+\\d+(?::\\d+(?:[-–]\\d+)?)?`, "i");

/** Book name from a reference, e.g. "John 3:16" -> "John". */
export const bookOf = (ref?: string) => ref?.replace(/\s+\d.*$/, "").trim();

function decode(s: string) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

/**
 * Latest uploads from the channel's public RSS feed (15 most recent).
 * Revalidates every 30 min on Vercel. Returns [] if YouTube is unreachable,
 * and pages render an empty state linking to the channel.
 * TODO: switch to YouTube Data API v3 (needs API key) for full archive + pagination.
 */
export async function getLatestSermons(): Promise<Sermon[]> {
  try {
    const res = await fetch(youtube.rss, { next: { revalidate: 1800 }, signal: AbortSignal.timeout(5000) });
    if (!res.ok) return [];
    const xml = await res.text();
    const entries = xml.split("<entry>").slice(1);
    return entries.map((e) => {
      const id = e.match(/<yt:videoId>([^<]+)/)?.[1] ?? "";
      const title = decode(e.match(/<title>([^<]+)/)?.[1] ?? "Untitled");
      const published = e.match(/<published>([^<]+)/)?.[1] ?? "";
      const meta = sermonMeta[id] ?? {};
      return {
        id,
        title,
        published,
        thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
        series: meta.series,
        speaker: meta.speaker,
        scripture: meta.scripture ?? title.match(SCRIPTURE_RE)?.[0],
      };
    });
  } catch {
    return [];
  }
}
