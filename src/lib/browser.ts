/**
 * Web Serial is what lets a web page talk to the device over USB. It exists in
 * desktop Chromium browsers only (Chrome, Edge, Opera); Safari, Firefox and
 * most mobile browsers do not have it.
 */
export type BrowserSupport = { supported: boolean; name: string };

export function detectBrowser(): BrowserSupport {
  if (typeof navigator === "undefined") return { supported: false, name: "" };
  const ua = navigator.userAgent;
  const name = /Edg\//.test(ua)
    ? "Edge"
    : /OPR\//.test(ua)
      ? "Opera"
      : /Chrome\//.test(ua)
        ? "Chrome"
        : /Firefox\//.test(ua)
          ? "Firefox"
          : /Safari\//.test(ua)
            ? "Safari"
            : "Browser";
  return { supported: "serial" in navigator, name };
}
