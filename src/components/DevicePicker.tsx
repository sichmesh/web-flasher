"use client";

import { useMemo, useState } from "react";
import Modal from "@/components/Modal";
import { useLang } from "@/i18n/LanguageProvider";
import { DEVICES, localized, type Device } from "@/lib/devices";

const REPO = "sichmesh/web-flasher";

export default function DevicePicker({
  open,
  onClose,
  onPick,
}: {
  open: boolean;
  onClose: () => void;
  onPick: (d: Device) => void;
}) {
  const { t, lang } = useLang();
  const [filter, setFilter] = useState<string>("all");

  // Filters grow by themselves as makers add boards: one per vendor and chip
  const filters = useMemo(() => {
    const count = (key: (d: Device) => string) =>
      Object.entries(
        DEVICES.reduce<Record<string, number>>((acc, d) => {
          acc[key(d)] = (acc[key(d)] ?? 0) + 1;
          return acc;
        }, {})
      );
    return [
      { id: "all", label: t.picker.all, n: DEVICES.length },
      ...count((d) => d.vendor).map(([v, n]) => ({ id: `v:${v}`, label: v, n })),
      ...count((d) => d.chip).map(([c, n]) => ({ id: `c:${c}`, label: c, n, mono: true })),
    ];
  }, [t]);

  const shown = DEVICES.filter(
    (d) =>
      filter === "all" ||
      (filter.startsWith("v:") && d.vendor === filter.slice(2)) ||
      (filter.startsWith("c:") && d.chip === filter.slice(2))
  );

  return (
    <Modal open={open} onClose={onClose} title={t.picker.title}>
      <div className="mb-4 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`rounded-full border px-3 py-1 text-xs transition-colors ${
              filter === f.id
                ? "border-gold bg-gold font-semibold text-bg"
                : "border-line/60 text-dim hover:text-warm"
            } ${"mono" in f && f.mono ? "font-mono" : ""}`}
          >
            {f.label} <span className="opacity-60">{f.n}</span>
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {shown.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => onPick(d)}
            className="group relative rounded-2xl border border-white/10 bg-[radial-gradient(ellipse_at_50%_30%,rgb(var(--gold)/0.08),transparent_70%)] p-4 text-left transition-all hover:-translate-y-1 hover:border-gold/60"
          >
            {d.reference && (
              <span className="absolute right-3 top-3 rounded-md bg-gold/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-gold">
                {t.picker.reference}
              </span>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={d.image} alt={d.name} className="mx-auto my-2 h-40 w-auto object-contain" draggable={false} />
            <p className="font-body text-sm font-semibold text-warm">{d.name}</p>
            <p className="mt-0.5 text-xs text-dim">{localized(d.specs, lang)}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              <span className="rounded-md bg-steel/15 px-2 py-0.5 font-mono text-[10px] text-blue-200">{d.chip}</span>
              <span className="rounded-md bg-steel/15 px-2 py-0.5 font-mono text-[10px] text-blue-200">{d.vendor}</span>
            </div>
          </button>
        ))}

        {/* Invitation for third-party hardware */}
        <a
          href={`https://github.com/${REPO}#adding-a-device`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 p-4 text-center transition-colors hover:border-gold/50"
        >
          <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-dashed border-gold/60 text-xl text-gold">
            +
          </span>
          <span className="font-body text-sm font-semibold text-warm">{t.picker.addTitle}</span>
          <span className="mt-1 text-xs leading-relaxed text-dim">
            {t.picker.addText} <span className="font-mono text-gold">{REPO}</span>
          </span>
        </a>
      </div>
    </Modal>
  );
}
