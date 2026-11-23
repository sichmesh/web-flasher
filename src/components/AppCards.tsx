"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { APP } from "@/lib/app";

export type AppText = {
  android: { name: string; badge: string; meta: string; cta: string; note: string };
  ios: { name: string; meta: string; cta: string; note: string };
  install: { title: string; steps: string[]; hint: string; fingerprint: string };
};

// Our own icons (a phone with a download arrow, a phone with a clock): no store badges or
// platform logos until the app is in those stores.
function PhoneDownload({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden>
      <rect x="12" y="4" width="24" height="40" rx="5" stroke="currentColor" strokeWidth="2.4" />
      <path d="M21 8.5h6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M24 16v14m0 0-5.5-5.5M24 30l5.5-5.5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 36h12" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

function PhoneSoon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden>
      <rect x="12" y="4" width="24" height="40" rx="5" stroke="currentColor" strokeWidth="2.4" />
      <path d="M21 8.5h6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="24" cy="24" r="7.5" stroke="currentColor" strokeWidth="2.2" />
      <path d="M24 20v4.5l3 2" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 12 8"
      className={`h-2 w-3 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
      fill="none"
      aria-hidden
    >
      <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Android (download + how to install) and iPhone (coming soon), side by side. */
export default function AppCards({ text }: { text: AppText }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="grid items-start gap-4 md:grid-cols-2">
      {/* Android */}
      <div className="relative flex flex-col overflow-hidden rounded-3xl border border-gold/40 bg-gradient-to-b from-card/90 to-bg/90 p-6 shadow-[0_18px_44px_-22px_rgb(var(--gold)/0.5)] backdrop-blur sm:p-7">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold/10 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-gold/35 bg-gold/10 text-gold">
            <PhoneDownload className="h-8 w-8" />
          </div>
          <div>
            <p className="flex items-center gap-2 text-xl font-semibold text-warm">
              {text.android.name}
              <span className="rounded-full border border-gold/45 bg-gold/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-gold">
                {text.android.badge}
              </span>
            </p>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-dim">
              SICH Mesh {APP.version} · {text.android.meta}
            </p>
          </div>
        </div>
        <p className="relative mt-4 text-sm leading-relaxed text-dim">{text.android.note}</p>

        <a href={APP.apkUrl} className="btn-gold relative mt-5 w-full" rel="noopener">
          <span className="relative z-10 flex items-center justify-center gap-2">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
              <path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 20h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {text.android.cta}
          </span>
        </a>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="relative mt-4 flex items-center justify-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-gold transition-colors hover:text-warm"
        >
          {text.install.title}
          <Chevron open={open} />
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative overflow-hidden"
            >
              <ol className="mt-4 space-y-3 text-left">
                {text.install.steps.map((s, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed text-slate-300">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gold/40 font-mono text-[11px] text-gold">
                      {i + 1}
                    </span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-3 text-xs leading-relaxed text-dim">{text.install.hint}</p>
              {APP.sha256 && (
                <div className="mt-4 rounded-xl border border-line/60 bg-bg/60 px-3 py-2.5 text-left">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-dim">
                    {text.install.fingerprint}
                  </p>
                  <p className="mt-1 break-all font-mono text-[11px] leading-relaxed text-warm">{APP.sha256}</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* iPhone */}
      <div className="relative flex flex-col rounded-3xl border border-white/[0.07] bg-gradient-to-b from-card/70 to-bg/80 p-6 backdrop-blur sm:p-7">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-line/60 bg-panel/40 text-dim">
            <PhoneSoon className="h-8 w-8" />
          </div>
          <div>
            <p className="text-xl font-semibold text-warm">{text.ios.name}</p>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-dim">{text.ios.meta}</p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-dim">{text.ios.note}</p>
        <button
          type="button"
          disabled
          className="mt-5 w-full cursor-not-allowed rounded-full border border-line/60 bg-panel/40 px-8 py-3.5 text-sm font-semibold text-dim"
        >
          {text.ios.cta}
        </button>
      </div>
    </div>
  );
}
