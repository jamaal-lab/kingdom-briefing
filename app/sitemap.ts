import type { MetadataRoute } from "next";
import { church } from "@/content/site";
import { ministries } from "@/content/ministries";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/im-new", "/watch", "/connect", "/our-story", "/give", "/events", "/care", "/contact"];
  return [
    ...pages.map((p) => ({ url: `${church.url}${p}`, changeFrequency: "weekly" as const, priority: p ? 0.8 : 1 })),
    ...ministries.map((m) => ({ url: `${church.url}/connect/${m.slug}`, changeFrequency: "monthly" as const, priority: 0.5 })),
  ];
}
