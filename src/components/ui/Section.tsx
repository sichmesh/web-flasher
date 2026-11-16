export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2.5 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
      </span>
      <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
        {children}
      </span>
    </div>
  );
}
