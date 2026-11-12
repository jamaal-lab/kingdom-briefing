import type { MetadataRoute } from "next";
import { church } from "@/content/site";

/** DEMO: block all crawlers until the church approves. At launch, set DEMO_NOINDEX=false. */
const DEMO_NOINDEX = process.env.DEMO_NOINDEX !== "false";

export default function robots(): MetadataRoute.Robots {
  return DEMO_NOINDEX
    ? { rules: { userAgent: "*", disallow: "/" } }
    : { rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/design"] }, sitemap: `${church.url}/sitemap.xml` };
}
