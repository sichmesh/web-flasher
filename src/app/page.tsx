"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import DevicePicker from "@/components/DevicePicker";
import FlashDialog from "@/components/FlashDialog";
import NetworkCanvas from "@/components/ui/NetworkCanvas";
import { SectionLabel } from "@/components/ui/Section";
import { useLang } from "@/i18n/LanguageProvider";
import { DEVICES, sortedReleases, type Device } from "@/lib/devices";
import { detectBrowser, type BrowserSupport } from "@/lib/browser";

const GITHUB_URL = "https://github.com/sichmesh/web-flasher";

export default function FlasherPage() {
  const { t } = useLang();
  const [browser, setBrowser] = useState<BrowserSupport | null>(null);
  const [device, setDevice] = useState<Device | null>(null);
  const [version, setVersion] = useState("");
  const [done, setDone] = useState(false);
  const [picker, setPicker] = useState(false);
  const [dialog, setDialog] = useState(false);

  // Browser-only check (the page is prerendered, so it runs after mount)
  useEffect(() => setBrowser(detectBrowser()), []);

  const releases = device ? sortedReleases(device) : [];
  const release = releases.find((r) => r.version === version) ?? releases[0];
  const canFlash = !!(device && release && browser?.supported);
  const active = done ? 3 : device ? (release ? 2 : 1) : 0;

  const pick = (d: Device) => {
    setDevice(d);
    setVersion(sortedReleases(d)[0]?.version ?? "");
    setDone(false);
    setPicker(false);
  };

  const cards = [
    {
      key: t.steps.device.label,
      title: t.steps.device.title,
      desc: t.steps.device.desc,
      control: device ? (
        <button
          type="button"
          onClick={() => setPicker(true)}
          className="flex w-full items-center gap-3 rounded-xl border border-gold/35 bg-bg px-3 py-2 text-left transition-colors hover:border-gold/70"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={device.image} alt="" className="h-11 w-auto" />
          <span>
            <span className="block text-sm font-semibold text-warm">{device.name}</span>
            <span className="block font-mono text-[11px] uppercase text-gold">
              {device.reference ? `${t.picker.reference} · ` : ""}
              {device.chip}
            </span>
          </span>
        </button>
      ) : (
        <button type="button" onClick={() => setPicker(true)} className="btn-flash w-full">
          {t.steps.device.select}
        </button>
      ),
    },
    {
      key: t.steps.firmware.label,
      title: t.steps.firmware.title,
      desc: device && !releases.length ? t.steps.firmware.soonDesc : t.steps.firmware.desc,
      control:
        device && releases.length ? (
          <select
            value={release?.version}
            onChange={(e) => {
              setVersion(e.target.value);
              setDone(false);
            }}
            className="w-full appearance-none rounded-xl border border-gold/45 bg-bg bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2212%22%20height=%228%22%3E%3Cpath%20d=%22M1%201l5%205%205-5%22%20stroke=%22%23e6b84a%22%20fill=%22none%22%20stroke-width=%221.6%22/%3E%3C/svg%3E')] bg-[length:12px_8px] bg-[right_14px_center] bg-no-repeat px-4 py-2.5 text-sm text-warm"
          >
            {releases.map((r) => (
              <option key={r.version} value={r.version} className="bg-bg">
                SICH {r.version} · {t.channel[r.channel]}
              </option>
            ))}
          </select>
        ) : (
          <div className="w-full rounded-xl border border-line/50 bg-bg/60 px-4 py-2.5 text-sm text-slate-600">
            {device ? t.steps.firmware.soon : "—"}
          </div>
        ),
    },
    {
      key: t.steps.flash.label,
      title: t.steps.flash.title,
      desc: t.steps.flash.desc,
      control: (
        <button type="button" disabled={!canFlash} onClick={() => setDialog(true)} className="btn-flash w-full">
          {device && !releases.length ? t.steps.flash.soon : done ? t.steps.flash.again : t.steps.flash.cta}
        </button>
      ),
    },
  ];

  return (
    <main id="top" className="relative min-h-screen overflow-x-hidden bg-bg">
      {/* living mesh background, same as sichmesh.org */}
      <div className="pointer-events-none fixed inset-0">
        <NetworkCanvas className="h-full w-full opacity-70" interactive={false} density={0.00006} />
      </div>
      <div className="pointer-events-none absolute right-[-10%] top-24 h-[520px] w-[520px] rounded-full bg-gold/10 blur-[150px]" />

      <Header />

      <section className="relative px-5 pb-16 pt-28 sm:px-8 sm:pt-32">
        <div className="mx-auto max-w-6xl">
          {/* Hero */}
          <div className="grid items-center gap-8 md:grid-cols-[1.25fr_0.75fr]">
            <div>
              <SectionLabel>{t.hero.label}</SectionLabel>
              <h1 className="glow-text mt-5 font-display text-5xl leading-none text-gold sm:text-6xl">{t.hero.title}</h1>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-dim sm:text-lg">{t.hero.lead}</p>
              <div className="mt-5 flex flex-wrap gap-2 font-mono text-[11px]">
                {browser?.supported && (
                  <span className="rounded-full border border-green/35 px-3 py-1 text-green">
                    ✓ {browser.name} · {t.hero.ready}
                  </span>
                )}
                <span className="rounded-full border border-line/60 px-3 py-1 text-dim">{t.hero.license}</span>
              </div>
            </div>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative hidden justify-center md:flex"
            >
              <div className="absolute h-64 w-64 rounded-full bg-gold/20 blur-[90px]" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={(device ?? DEVICES[0])?.image}
                alt="SICH device"
                className="relative h-[300px] w-auto drop-shadow-[0_24px_32px_rgba(0,0,0,0.6)]"
                draggable={false}
              />
            </motion.div>
          </div>

          {/* Browser without Web Serial */}
          {browser && !browser.supported && (
            <div className="mt-8 rounded-2xl border border-coral/40 bg-coral/10 px-5 py-4">
              <p className="font-semibold text-coral">{t.hero.unsupportedTitle}</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-300">{t.hero.unsupported}</p>
            </div>
          )}

          {/* Steps */}
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {cards.map((c, i) => {
              const state = i < active ? "done" : i === active ? "active" : "idle";
              const off = i > 0 && !device;
              return (
                <div
                  key={i}
                  className={`relative flex min-h-[200px] flex-col rounded-3xl border bg-gradient-to-b from-card/85 to-ink-800/85 p-5 backdrop-blur transition-all duration-300 ${
                    state === "active"
                      ? "border-gold/50 shadow-[0_18px_40px_-20px_rgb(var(--gold)/0.45)]"
                      : "border-white/[0.07]"
                  } ${off ? "opacity-55" : ""}`}
                >
                  <span
                    className={`absolute right-4 top-2 font-display text-5xl ${
                      state === "idle" ? "text-white/[0.06]" : "text-gold/15"
                    }`}
                  >
                    0{i + 1}
                  </span>
                  <p
                    className={`font-mono text-[11px] uppercase tracking-[0.22em] ${
                      state === "idle" ? "text-dim" : "text-gold"
                    }`}
                  >
                    {state === "done" ? "✓" : "●"} {c.key}
                  </p>
                  <h2 className="mt-3 text-lg font-semibold text-warm">{c.title}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-dim">{c.desc}</p>
                  <div className="mt-auto pt-4">{c.control}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="relative border-t border-white/[0.06] px-5 py-6 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 font-mono text-[11px] text-slate-600 sm:flex-row">
          <span>
            {t.footer.trademark} · {t.footer.license}
          </span>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="tracking-[0.14em] text-dim hover:text-gold">
            GITHUB ↗
          </a>
        </div>
      </footer>

      <DevicePicker open={picker} onClose={() => setPicker(false)} onPick={pick} />
      {device && release && (
        <FlashDialog
          open={dialog}
          device={device}
          release={release}
          onClose={() => setDialog(false)}
          onDone={() => {
            setDialog(false);
            setDone(true);
          }}
        />
      )}
    </main>
  );
}
