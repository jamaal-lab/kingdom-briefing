import type { Metadata, Viewport } from "next";
import { Big_Shoulders, Instrument_Serif, Inter } from "next/font/google";
import "./globals.css";
import { church } from "@/content/site";

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
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

// Zoom stays enabled: no maximumScale / userScalable overrides (WCAG 1.4.4).
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#04070d",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${serif.variable} ${sans.variable}`}>
      <body className="antialiased">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
