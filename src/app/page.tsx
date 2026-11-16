"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { SectionLabel } from "@/components/ui/Section";
import { useLang } from "@/i18n/LanguageProvider";
import devicesJson from "../../public/firmware/devices.json";

// ─── Device registry ──────────────────────────────────────────────────────────
// Supported devices live in public/firmware/devices.json — adding a board only
// needs its firmware folder plus one entry there.

type FlashDevice = {
  id: string;
  name: string;
  manifest: string;
};

const DEVICES: FlashDevice[] = devicesJson;

// Group icons — index-matched to flash.capabilities.groups.
const CAP_ICONS = [
  // Communication / mesh — broadcast waves
  <svg key="mesh" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
    <circle cx="12" cy="12" r="1.6" fill="currentColor" />
    <path
      d="M8.5 8.5a5 5 0 000 7M15.5 8.5a5 5 0 010 7M5.5 5.5a9 9 0 000 13M18.5 5.5a9 9 0 010 13"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>,
  // Navigation / time — compass
  <svg key="nav" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
    <path
      d="M15.5 8.5l-2.2 4.8-4.8 2.2 2.2-4.8 4.8-2.2z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  </svg>,
  // Audio — waveform
  <svg key="audio" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
    <path
      d="M4 10v4M8 6.5v11M12 3.5v17M16 7v10M20 10v4"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>,
  // Connectivity / system — wifi
  <svg key="wifi" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
    <path
      d="M5 12.5a10 10 0 0114 0M8 15.5a6 6 0 018 0"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <circle cx="12" cy="19" r="1.1" fill="currentColor" />
  </svg>,
];

export default function FlasherPage() {
  const { t } = useLang();
  const [selectedId, setSelectedId] = useState<string>(DEVICES[0]?.id ?? "");
  const [ready, setReady] = useState(false);
  const [supported, setSupported] = useState(false);
  const [version, setVersion] = useState<string | null>(null);

  const selected: FlashDevice | undefined =
    DEVICES.find((d) => d.id === selectedId) ?? DEVICES[0];
  const hasDevices = DEVICES.length > 0;

  useEffect(() => {
    // Browser-only: register the <esp-web-install-button> custom element and
    // feature-detect Web Serial. Kept out of module scope so SSR/prerender
    // never touches window/customElements.
    setSupported(typeof navigator !== "undefined" && "serial" in navigator);
    import("esp-web-tools").finally(() => setReady(true));
  }, []);

  // Show the firmware version straight from the selected device's manifest, so
  // it always matches what actually gets flashed (single source of truth).
  useEffect(() => {
    let active = true;
    setVersion(null);
    if (!selected) return;
    fetch(selected.manifest)
      .then((r) => (r.ok ? r.json() : null))
      .then((m) => {
        if (active && m && typeof m.version === "string") setVersion(m.version);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [selected?.manifest]);

  return (
    <main id="top" className="relative min-h-screen overflow-x-hidden bg-bg">
      <Header />

      <section className="relative overflow-hidden px-5 pb-28 pt-32 sm:px-8 sm:pt-36">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="pointer-events-none absolute left-1/2 top-24 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-gold/12 blur-[150px]" />

        <div className="relative mx-auto max-w-3xl">
          {/* Intro */}
          <div className="text-center">
            <div className="flex justify-center">
              <SectionLabel>{t.flash.label}</SectionLabel>
            </div>
            <h1 className="mt-6 font-body text-4xl font-bold tracking-tight text-warm sm:text-5xl">
              <span className="text-gradient">{t.flash.title}</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-dim sm:text-lg">
              {t.flash.lead}
            </p>
          </div>

          {/* Flasher card */}
          <div className="card-panel mt-12 p-6 sm:p-8">
            {hasDevices ? (
              <>
                {/* Device selector */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-gold">
                    {t.flash.deviceLabel}
                  </p>
                  {version && (
                    <span className="rounded-full border border-line/60 bg-panel/40 px-3 py-1 font-mono text-[11px] tracking-wide text-dim">
                      {t.flash.version} {version}
                    </span>
                  )}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {DEVICES.map((d) => {
                    const active = d.id === selectedId;
                    return (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => setSelectedId(d.id)}
                        aria-pressed={active}
                        className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-colors ${
                          active
                            ? "border-gold/60 bg-gold/10 text-warm"
                            : "border-line/60 bg-panel/40 text-dim hover:border-gold/40 hover:text-warm"
                        }`}
                      >
                        {d.name}
                      </button>
                    );
                  })}
                </div>

                {/* Flash action */}
                <div className="mt-8 flex flex-col items-center gap-4 border-t border-line/50 pt-8">
                  {!ready ? (
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-dim">
                      …
                    </p>
                  ) : supported ? (
                    <esp-web-install-button
                      key={selected?.id}
                      manifest={selected?.manifest}
                    >
                      <button
                        slot="activate"
                        type="button"
                        className="btn-gold"
                      >
                        {t.flash.flashCta}
                      </button>
                    </esp-web-install-button>
                  ) : (
                    <div className="w-full rounded-2xl border border-coral/30 bg-coral/5 p-5 text-center">
                      <p className="font-body text-base font-semibold text-coral">
                        {t.flash.unsupportedTitle}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-dim">
                        {t.flash.unsupported}
                      </p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center py-6 text-center">
                <span className="rounded-full border border-gold/40 bg-gold/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.25em] text-gold">
                  {t.flash.comingSoonBadge}
                </span>
                <p className="mt-5 font-body text-xl font-semibold text-warm">
                  {t.flash.comingSoonTitle}
                </p>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-dim">
                  {t.flash.comingSoon}
                </p>
                <a
                  href="https://discord.gg/zpVgjRxdQJ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold mt-7"
                >
                  {t.flash.comingSoonCta}
                </a>
              </div>
            )}
          </div>

          {/* Steps */}
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="card-panel p-6">
              <h2 className="font-body text-lg font-semibold text-warm">
                {t.flash.stepsTitle}
              </h2>
              <ol className="mt-4 space-y-3">
                {t.flash.steps.map((step, i) => (
                  <li
                    key={i}
                    className="flex gap-3 text-sm leading-relaxed text-dim"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-gold/10 font-mono text-[11px] text-gold">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Troubleshooting */}
            <div className="card-panel p-6">
              <h2 className="font-body text-lg font-semibold text-warm">
                {t.flash.troubleTitle}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-dim">
                {t.flash.trouble}
              </p>
            </div>
          </div>

          {/* ── Firmware capabilities ─────────────────────────────── */}
          <div className="mt-20">
            <div className="text-center">
              <div className="flex justify-center">
                <SectionLabel>{t.flash.capabilities.label}</SectionLabel>
              </div>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <h2 className="font-body text-2xl font-bold tracking-tight text-warm sm:text-3xl">
                  {t.flash.capabilities.title}
                </h2>
                {version && (
                  <span className="rounded-full border border-gold/40 bg-gold/10 px-2.5 py-0.5 font-mono text-[11px] tracking-wide text-gold">
                    v{version}
                  </span>
                )}
              </div>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-dim sm:text-base">
                {t.flash.capabilities.intro}
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {t.flash.capabilities.groups.map((group, i) => (
                <div key={i} className="card-panel p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gold/25 bg-gold/5 text-gold">
                      {CAP_ICONS[i]}
                    </span>
                    <h3 className="font-body text-base font-semibold text-warm">
                      {group.title}
                    </h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-dim">
                    {group.intro}
                  </p>
                  <ul className="mt-4 space-y-2.5">
                    {group.items.map((item, j) => (
                      <li
                        key={j}
                        className="flex gap-2.5 text-sm leading-relaxed text-warm/85"
                      >
                        <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-gold/70" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Experimental note */}
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-line/50 bg-panel/30 px-5 py-4">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
                className="mt-0.5 h-4 w-4 shrink-0 text-gold"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <path
                  d="M12 11v5M12 8h.01"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
              <p className="text-xs leading-relaxed text-dim sm:text-sm">
                {t.flash.capabilities.note}
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-line/50 px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-3xl flex-col items-center justify-between gap-3 text-xs text-dim sm:flex-row">
          <a
            href="https://sichmesh.org"
            className="font-mono uppercase tracking-[0.18em] transition-colors hover:text-gold"
          >
            sichmesh.org
          </a>
          <a
            href="https://github.com/sichmesh/web-flasher"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-gold"
          >
            {t.footer.license}
          </a>
        </div>
      </footer>
    </main>
  );
}
