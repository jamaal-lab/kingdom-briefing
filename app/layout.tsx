import type { Metadata, Viewport } from "next";
import { Big_Shoulders, Instrument_Serif, Inter } from "next/font/google";
import "./globals.css";
import { church, serviceTimes, social } from "@/content/site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const display = Big_Shoulders({
  variable: "--font-big-shoulders",
  subsets: ["latin"],
  weight: ["600", "800", "900"],
});
const serif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});
const sans = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(church.url),
  title: {
    default: `${church.shortName} | ${church.nickname} · Chicago, IL`,
    template: `%s | ${church.shortName}`,
  },
  description: `${church.name}, founded in ${church.founded} by ${church.founder}. Senior Pastor ${church.seniorPastor}. Sunday worship at 4543 S Princeton Ave.`,
  // DEMO: keep out of search engines until the church approves the build.
  robots:
    process.env.DEMO_NOINDEX === "false"
      ? undefined
      : { index: false, follow: false, googleBot: { index: false, follow: false } },
};

// Zoom stays enabled: no maximumScale / userScalable overrides (WCAG 1.4.4).
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#04070d",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Church",
  name: church.name,
  alternateName: [church.shortName, church.nickname],
  url: church.url,
  telephone: "+1-773-924-3232",
  foundingDate: String(church.founded),
  founder: { "@type": "Person", name: "Clay Evans" },
  employee: { "@type": "Person", name: church.seniorPastor, jobTitle: "Senior Pastor" },
  address: {
    "@type": "PostalAddress",
    streetAddress: church.address.street,
    addressLocality: church.address.city,
    addressRegion: church.address.state,
    postalCode: church.address.zip,
    addressCountry: "US",
  },
  sameAs: [social.facebook, social.instagram, social.youtube],
  event: serviceTimes
    .filter((s) => !s.seasonal)
    .map((s) => ({
      "@type": "Event",
      name: `${s.label} (${s.day} ${s.display})`,
      eventSchedule: { "@type": "Schedule", byDay: `https://schema.org/${s.day}`, startTime: s.time, repeatFrequency: "P1W", scheduleTimezone: "America/Chicago" },
      location: { "@type": "Place", name: church.shortName, address: `${church.address.street}, ${church.address.city}, ${church.address.state} ${church.address.zip}` },
    })),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${serif.variable} ${sans.variable}`}>
      <body className="antialiased">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
