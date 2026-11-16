"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/i18n/LanguageProvider";
import Logo from "@/components/ui/Logo";
import UaFlag from "@/components/ui/UaFlag";

const WEBSITE_URL = "https://sichmesh.org";
const DISCORD_URL = "https://discord.gg/zpVgjRxdQJ";
const GITHUB_URL = "https://github.com/sichmesh";

export default function Header() {
  const { t, lang, setLang } = useLang();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-line/60 bg-bg/80 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <a href={WEBSITE_URL} className="group flex items-center gap-2.5" aria-label="SICH">
          <Logo className="h-10 w-auto transition-transform duration-300 group-hover:scale-105" />
          <span className="flex items-center gap-2">
            <span className="font-display text-base tracking-[0.12em] text-warm">
              SICH
            </span>
            <UaFlag className="h-[15px] w-auto shrink-0" />
          </span>
        </a>

        <div className="flex items-center gap-3 sm:gap-5">
          <nav className="hidden items-center gap-5 sm:flex">
            {[
              { href: WEBSITE_URL, label: t.nav.website },
              { href: DISCORD_URL, label: t.nav.discord },
              { href: GITHUB_URL, label: t.nav.github },
            ].map((l) => (
              <a
                key={l.href}
                href={l.href}
                target={l.href === WEBSITE_URL ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="whitespace-nowrap font-mono text-xs uppercase tracking-[0.18em] text-dim transition-colors hover:text-gold"
              >
                {l.label} ↗
              </a>
            ))}
          </nav>

          {/* Language switcher */}
          <div className="flex items-center rounded-full border border-line/70 bg-panel/40 p-0.5">
            {(["en", "ua"] as const).map((code) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                className="relative rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide transition-colors"
              >
                {lang === code && (
                  <motion.span
                    layoutId="lang-pill"
                    className="absolute inset-0 rounded-full bg-gold"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className={`relative ${lang === code ? "text-bg" : "text-dim"}`}>
                  {code === "en" ? "EN" : "UA"}
                </span>
              </button>
            ))}
          </div>

        </div>
      </div>
    </motion.header>
  );
}
