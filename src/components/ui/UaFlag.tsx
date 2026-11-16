/**
 * Minimal, flat Ukrainian flag — inline SVG (no emoji).
 *
 * Variant: "rounded, no frame" — a rounded rectangle split horizontally,
 * blue over yellow, with softly rounded corners and no visible border. A
 * barely-there inner hairline (--line token, very low opacity) keeps the
 * edges from bleeding into the dark background while still reading as flat.
 *
 * Aspect ratio is locked to 3:2 via the viewBox; size it with `className`.
 */
export default function UaFlag({
  className = "h-4 w-auto",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 30 20"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Ukraine"
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {/* Clip everything to the rounded rectangle so both stripes share
            the same soft corners. */}
        <clipPath id="uaFlagRadius">
          <rect x="0" y="0" width="30" height="20" rx="2" ry="2" />
        </clipPath>
      </defs>
      <g clipPath="url(#uaFlagRadius)">
        <rect x="0" y="0" width="30" height="10" fill="#0057B7" />
        <rect x="0" y="10" width="30" height="10" fill="#FFD700" />
        {/* Extremely subtle inner hairline — barely visible, keeps the flat
            edge crisp on the night background. */}
        <rect
          x="0.5"
          y="0.5"
          width="29"
          height="19"
          rx="1.7"
          ry="1.7"
          fill="none"
          stroke="rgb(var(--line))"
          strokeOpacity="0.35"
          strokeWidth="1"
        />
      </g>
    </svg>
  );
}
