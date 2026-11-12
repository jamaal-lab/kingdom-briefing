/**
 * Sermon metadata that YouTube does not provide. Keyed by YouTube video id.
 * The library merges this with the channel's latest uploads (lib/youtube.ts).
 * Scripture is also auto-detected from titles when it isn't set here.
 */
export const sermonMeta: Record<string, { series?: string; scripture?: string; speaker?: string }> = {
  // "VIDEO_ID": { series: "Series Name", scripture: "John 3:16", speaker: "Pastor Reginald W. Sharpe Jr." },
};

/** Music: playlist ids from the YouTube channel. TODO: church to supply. */
export const musicPlaylists: { id: string; title: string }[] = [];
