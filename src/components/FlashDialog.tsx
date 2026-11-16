"use client";

import { useEffect, useRef, useState } from "react";
import Modal from "@/components/Modal";
import { useLang } from "@/i18n/LanguageProvider";
import { localized, type Device, type Release } from "@/lib/devices";
import { flash, type Phase } from "@/lib/flasher";

type Status = "notes" | "ready" | "running" | "done" | "error";

export default function FlashDialog({
  open,
  device,
  release,
  onClose,
  onDone,
}: {
  open: boolean;
  device: Device;
  release: Release;
  onClose: () => void;
  onDone: () => void;
}) {
  const { t, lang } = useLang();
  const notes = localized(release.notes, lang) ?? [];
  const [status, setStatus] = useState<Status>(notes.length ? "notes" : "ready");
  const [erase, setErase] = useState(false);
  const [phase, setPhase] = useState<Phase | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [log, setLog] = useState<string[]>([]);
  const [showLog, setShowLog] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  // Fresh state every time the dialog opens
  useEffect(() => {
    if (!open) return;
    setStatus(notes.length ? "notes" : "ready");
    setPhase(null);
    setProgress(0);
    setError("");
    setLog([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, release.version]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [log, showLog]);

  const run = async () => {
    setStatus("running");
    setError("");
    setProgress(0);
    setLog([]);
    try {
      await flash({
        manifestUrl: release.manifest,
        eraseAll: erase,
        onPhase: setPhase,
        onProgress: setProgress,
        onLog: (l) => setLog((prev) => [...prev.slice(-200), l]),
      });
      setProgress(1);
      setStatus("done");
    } catch (e) {
      const err = e as Error;
      setError(err.name === "NotFoundError" ? t.dialog.cancelled : `${t.dialog.failed} ${err.message}`);
      setStatus("error");
    }
  };

  const phases: { id: Phase; label: string }[] = [
    { id: "erase", label: t.dialog.phases.erase },
    { id: "write", label: t.dialog.phases.write },
    { id: "verify", label: t.dialog.phases.verify },
  ];
  const order: Phase[] = ["connect", "erase", "write", "verify", "done"];
  const phaseState = (p: Phase) => {
    if (status === "done") return "dn";
    if (!phase) return "";
    // without a clean install the erase step is part of the write
    if (p === "erase" && !erase && order.indexOf(phase) >= order.indexOf("write")) return "dn";
    const a = order.indexOf(phase);
    const b = order.indexOf(p);
    return b < a ? "dn" : b === a ? "on" : "";
  };

  const pct = Math.round(progress * 100);
  const statusLine =
    status === "done"
      ? `✓ SICH ${release.version} ${t.dialog.success}`
      : status === "error"
        ? error
        : status === "running"
          ? phase === "connect" || !phase
            ? t.dialog.connecting
            : `${phases.find((p) => p.id === phase)?.label ?? ""} · ${pct}%`
          : `${t.dialog.ready} · SICH ${release.version}`;

  const Btn = ({ onClick, children, disabled = false }: { onClick: () => void; children: React.ReactNode; disabled?: boolean }) => (
    <button type="button" onClick={onClick} disabled={disabled} className="btn-flash w-full">
      {children}
    </button>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      locked={status === "running"}
      title={status === "notes" ? `SICH ${release.version}` : `${t.dialog.title} · ${device.name}`}
    >
      {status === "notes" ? (
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-gold">{t.notes.whatsNew}</p>
          <ul className="mb-4 mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-300 marker:text-gold">
            {notes.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
          {release.changelog && (
            <a href={release.changelog} target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-steel hover:text-warm">
              {t.notes.changelog} ↗
            </a>
          )}
          <div className="mt-5">
            <Btn onClick={() => setStatus("ready")}>{t.notes.continue}</Btn>
          </div>
        </div>
      ) : (
        <div>
          <Row n="01" title={t.dialog.connectTitle}>
            <p className="text-sm leading-relaxed text-dim">{t.dialog.connectText}</p>
          </Row>

          <Row n="02" title={t.dialog.typeTitle}>
            <div className="mt-1 flex rounded-xl border border-line/50 bg-bg p-1">
              {[false, true].map((v) => (
                <button
                  key={String(v)}
                  type="button"
                  disabled={status === "running"}
                  onClick={() => setErase(v)}
                  className={`flex-1 rounded-lg px-2 py-2 text-xs transition-colors ${
                    erase === v ? "bg-panel text-warm shadow-[inset_0_0_0_1px_rgb(var(--gold)/0.45)]" : "text-dim hover:text-warm"
                  }`}
                >
                  {v ? t.dialog.clean : t.dialog.update}
                </button>
              ))}
            </div>
          </Row>

          <Row n="03" title={t.dialog.flashTitle} last>
            <div className="mb-2 mt-1 flex gap-1.5">
              {phases.map((p) => {
                const s = phaseState(p.id);
                return (
                  <span
                    key={p.id}
                    className={`flex-1 rounded-lg py-1.5 text-center font-mono text-[10px] uppercase tracking-[0.16em] ${
                      s === "dn" ? "bg-green/10 text-green" : s === "on" ? "bg-gold/15 text-gold" : "bg-panel/60 text-slate-600"
                    } ${p.id === "erase" && !erase && status !== "done" ? "opacity-50" : ""}`}
                  >
                    {p.label}
                  </span>
                );
              })}
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-panel/70">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#d9a73a] to-[#f7e2a6] shadow-[0_0_12px_rgb(var(--gold)/0.7)] transition-[width] duration-300"
                style={{ width: `${status === "done" ? 100 : pct}%` }}
              />
            </div>
            <p className={`mt-2 text-xs ${status === "done" ? "text-green" : status === "error" ? "text-coral" : "text-dim"}`}>
              {statusLine}
            </p>

            <button type="button" onClick={() => setShowLog((v) => !v)} className="mt-2 font-mono text-xs text-steel hover:text-warm">
              &gt;_ {showLog ? t.dialog.hideLog : t.dialog.showLog}
            </button>
            {showLog && (
              <div ref={logRef} className="mt-2 h-28 overflow-y-auto rounded-xl border border-white/5 bg-black/50 px-3 py-2 font-mono text-[11px] leading-relaxed text-dim">
                {log.length ? log.map((l, i) => <div key={i}>{l}</div>) : <div>—</div>}
              </div>
            )}
          </Row>

          <div className="mt-3">
            {status === "done" ? (
              <Btn onClick={onDone}>{t.dialog.done}</Btn>
            ) : (
              <Btn onClick={run} disabled={status === "running"}>
                {status === "error" ? t.dialog.retry : t.dialog.cta}
              </Btn>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}

function Row({ n, title, last = false, children }: { n: string; title: string; last?: boolean; children: React.ReactNode }) {
  return (
    <div className={`flex gap-3 py-3 ${last ? "" : "border-b border-white/5"}`}>
      <span className="w-8 shrink-0 font-display text-xl leading-none text-gold">{n}</span>
      <div className="min-w-0 flex-1">
        <p className="mb-1 text-sm font-semibold text-warm">{title}</p>
        {children}
      </div>
    </div>
  );
}
