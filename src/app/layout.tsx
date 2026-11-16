import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Black_Ops_One } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/i18n/LanguageProvider";

// Brand / display face — heavy military display type. Latin-only, so it is
// applied only to always-Latin brand text (the "SICH" wordmark + hero title).
const display = Black_Ops_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});
// Neutral, highly readable sans for body copy, nav, buttons and all
// (bilingual) headings.
const body = localFont({
  src: "../../public/fonts/SpaceGrotesk.woff2",
  variable: "--font-body",
  display: "swap",
});
const mono = localFont({
  src: "../../public/fonts/JetBrainsMono.woff2",
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SICH Web Flasher",
  description:
    "Install SICH firmware on your device straight from the browser — no drivers, no IDE.",
  metadataBase: new URL("https://flasher.sichmesh.org"),
};

export const viewport: Viewport = {
  themeColor: "#0b0e18",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
