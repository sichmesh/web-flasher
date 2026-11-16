import type { Config } from "tailwindcss";

/**
 * Gold + Night design system.
 *
 * All palette values live as space-separated RGB channels in globals.css
 * (:root --bg, --gold, …). Exposing them here through the
 * `rgb(var(--x) / <alpha-value>)` pattern keeps every Tailwind opacity
 * modifier (bg-gold/10, border-line/40, …) working while the single source
 * of truth stays in CSS variables.
 */
const withAlpha = (v: string) => `rgb(var(${v}) / <alpha-value>)`;

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // ── Gold + Night semantic tokens ──────────────────────────────
        bg: withAlpha("--bg"),
        card: withAlpha("--card"),
        panel: withAlpha("--panel"),
        gold: {
          DEFAULT: withAlpha("--gold"),
          glow: withAlpha("--gold"),
        },
        steel: {
          DEFAULT: withAlpha("--steel"),
          glow: withAlpha("--steel"),
        },
        warm: withAlpha("--warm"),
        dim: withAlpha("--dim"),
        line: withAlpha("--line"),
        green: withAlpha("--green"),
        coral: withAlpha("--coral"),

        // ── Legacy tokens remapped onto the new palette ──────────────
        // (keeps existing class names across all sections working while
        //  recoloring the whole site: primary → steel, accent → gold)
        ink: {
          900: withAlpha("--bg"),
          800: withAlpha("--bg-800"),
          700: withAlpha("--card"),
          600: withAlpha("--panel"),
          500: withAlpha("--panel-500"),
        },
        primary: {
          DEFAULT: withAlpha("--steel"),
          glow: withAlpha("--steel"),
        },
        accent: {
          DEFAULT: withAlpha("--gold"),
          glow: withAlpha("--gold"),
        },
        slate: {
          200: withAlpha("--warm"),
          300: withAlpha("--warm-300"),
          400: withAlpha("--dim"),
          500: withAlpha("--dim-500"),
          600: withAlpha("--dim-600"),
          700: withAlpha("--dim-700"),
          800: withAlpha("--dim-800"),
        },
        red: {
          300: withAlpha("--coral-300"),
          400: withAlpha("--coral"),
          500: withAlpha("--coral"),
        },
        blue: {
          200: withAlpha("--steel-200"),
        },
      },
      fontFamily: {
        // Black Ops One — brand/display only. Falls back to the body sans so
        // any non-Latin (e.g. Cyrillic) text degrades gracefully.
        display: [
          "var(--font-display)",
          "var(--font-body)",
          "system-ui",
          "sans-serif",
        ],
        // Neutral readable sans — body copy, nav, buttons, headings.
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        // Gold primary glow + steel secondary glow
        glow: "0 0 40px -8px rgb(var(--gold) / 0.5)",
        "glow-cyan": "0 0 46px -6px rgb(var(--gold) / 0.4)",
        "glow-steel": "0 0 46px -6px rgb(var(--steel) / 0.4)",
        gold: "0 10px 34px -12px rgb(var(--gold) / 0.55)",
        card: "0 18px 50px -22px rgb(0 0 0 / 0.7)",
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(to bottom, transparent, rgb(var(--bg)) 90%), radial-gradient(circle at 50% 0%, rgb(var(--gold) / 0.14), transparent 60%)",
      },
      keyframes: {
        "pulse-ring": {
          "0%": { transform: "scale(0.8)", opacity: "0.6" },
          "100%": { transform: "scale(2.2)", opacity: "0" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "pulse-ring": "pulse-ring 2.6s ease-out infinite",
        shimmer: "shimmer 2.2s infinite",
      },
    },
  },
  plugins: [],
};

export default config;
