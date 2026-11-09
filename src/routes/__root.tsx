import type { ReactNode } from "react";
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import appCss from "~/styles/app.css?url";
import { SITE } from "~/lib/site";
import { SITE_URL, INDEXABLE, absoluteUrl } from "~/lib/env";
import { NotFound } from "~/components/site/NotFound";
import { asset } from "~/lib/target";

// Direct check (not TARGET) so the minifier drops the flagship head from the /websites build.
const WEBSITES = import.meta.env.VITE_SITE_TARGET === "websites";
const title = () => `${SITE.name} — Beyond the Website. Into the Experience.`;
const description = () => `${SITE.positioning} ${SITE.promise}`;

const ORGANIZATION_JSON_LD = () =>
  JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    slogan: SITE.promise,
    description: SITE.positioning,
    email: SITE.email,
    ...(SITE_URL
      ? { url: `${SITE_URL}/`, logo: `${SITE_URL}/favicon.svg` }
      : {}),
    parentOrganization: { "@type": "Organization", name: SITE.parent },
  });

/**
 * The /websites build is a Bridge to Better Solutions page: the shell carries
 * only neutral document settings and the parent-company icon; the page route
 * sets its own title, description, social card and structured data.
 */
const WEBSITES_ROOT_HEAD = {
  meta: [
    { charSet: "utf-8" },
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1, viewport-fit=cover",
    },
    { name: "theme-color", content: "#10243A" },
    { name: "color-scheme", content: "dark" },
    ...(INDEXABLE ? [] : [{ name: "robots", content: "noindex, nofollow" }]),
  ],
  links: [
    { rel: "stylesheet", href: appCss },
    {
      rel: "icon",
      href: asset("brand/favicon-32.png"),
      type: "image/png",
      sizes: "32x32",
    },
    { rel: "apple-touch-icon", href: asset("brand/apple-touch-icon.png") },
    {
      rel: "preload",
      href: asset("fonts/instrument-serif-latin-400-normal.woff2"),
      as: "font",
      type: "font/woff2",
      crossOrigin: "anonymous" as const,
    },
    {
      rel: "preload",
      href: asset("fonts/hanken-grotesk-latin-wght-normal.woff2"),
      as: "font",
      type: "font/woff2",
      crossOrigin: "anonymous" as const,
    },
  ],
};

export const Route = createRootRoute({
  head: () => (WEBSITES ? WEBSITES_ROOT_HEAD : projectHead()),
  scripts: () =>
    WEBSITES
      ? []
      : [{ type: "application/ld+json", children: ORGANIZATION_JSON_LD() }],
  component: RootComponent,
  notFoundComponent: NotFound,
});

function projectHead() {
  const TITLE = title();
  const DESCRIPTION = description();
  return {
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, viewport-fit=cover",
      },
      { name: "theme-color", content: "#08111F" },
      { name: "color-scheme", content: "dark" },
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      ...(INDEXABLE ? [] : [{ name: "robots", content: "noindex, nofollow" }]),
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: SITE.name },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:image", content: absoluteUrl("/og-image.jpg") },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      {
        property: "og:image:alt",
        content:
          "Bridge Web: a gold-lit monumental gateway in a dark stone pavilion, with the words Beyond the website. Into the experience.",
      },
      ...(SITE_URL ? [{ property: "og:url", content: `${SITE_URL}/` }] : []),
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: absoluteUrl("/og-image.jpg") },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: asset("favicon.svg"), type: "image/svg+xml" },
      { rel: "canonical", href: absoluteUrl("/") },
      {
        rel: "preload",
        href: asset("fonts/instrument-serif-latin-400-normal.woff2"),
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous" as const,
      },
      {
        rel: "preload",
        href: asset("fonts/instrument-serif-latin-400-italic.woff2"),
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous" as const,
      },
      {
        rel: "preload",
        href: asset("fonts/hanken-grotesk-latin-wght-normal.woff2"),
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous" as const,
      },
    ],
  };
}

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
