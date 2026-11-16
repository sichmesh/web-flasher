import devicesJson from "../../public/firmware/devices.json";
import type { Lang } from "@/i18n/translations";

/**
 * Device catalogue. Everything lives in public/firmware/devices.json, so adding
 * a board or a release needs no code changes (see README → Adding a device).
 */

export type Channel = "stable" | "beta";

export type Release = {
  version: string;
  channel: Channel;
  /** esp-web-tools style manifest: { builds: [{ chipFamily, parts: [{ path, offset }] }] } */
  manifest: string;
  /** Short "what's new" list, 3–5 lines per language. */
  notes?: Partial<Record<Lang, string[]>>;
  /** Link to the full changelog (GitHub release). */
  changelog?: string;
};

export type Device = {
  id: string;
  name: string;
  vendor: string;
  chip: string;
  /** Reference hardware made by the SICH project itself. */
  reference?: boolean;
  image: string;
  specs: Partial<Record<Lang, string>>;
  releases: Release[];
};

export const DEVICES = devicesJson as Device[];

/** Stable releases first, newest first within a channel (file order). */
export function sortedReleases(device: Device): Release[] {
  const rank = (c: Channel) => (c === "stable" ? 0 : 1);
  return [...device.releases].sort((a, b) => rank(a.channel) - rank(b.channel));
}

export function localized<T>(value: Partial<Record<Lang, T>> | undefined, lang: Lang): T | undefined {
  return value?.[lang] ?? value?.en;
}
