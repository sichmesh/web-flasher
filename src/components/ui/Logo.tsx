/**
 * Official SICH emblem — the metallic gold trident-in-broken-circle mark.
 *
 * Renders the real logo asset from `public/logo.png` (1024×1024, transparent).
 * The source is square, so height-based sizing with `w-auto` preserves the
 * aspect ratio without distortion.
 *
 * Sizes used across the site:
 *   Header  → <Logo className="h-8 w-auto" />
 *   Hero    → <Logo className="h-24 w-auto sm:h-28" />
 *   Footer  → <Logo className="h-7 w-auto" glow={false} />
 */
export default function Logo({
  className = "",
  title = "SICH",
  glow = true,
}: {
  className?: string;
  title?: string;
  glow?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.png"
      alt={title}
      title={title}
      aria-label={title}
      width={1024}
      height={1024}
      draggable={false}
      decoding="async"
      className={`w-auto object-contain ${
        glow ? "drop-shadow-[0_4px_22px_rgba(230,184,74,0.35)]" : ""
      } ${className}`}
    />
  );
}
