import type { DetailedHTMLProps, HTMLAttributes } from "react";

/**
 * JSX typing for the <esp-web-install-button> custom element provided by
 * `esp-web-tools`. It is a web component (not React), so we declare it as an
 * intrinsic element to keep the JSX type-safe.
 *
 * React 19 exposes the JSX namespace from the "react" module, so we augment
 * it there.
 */
declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "esp-web-install-button": DetailedHTMLProps<
        HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        manifest?: string;
        "erase-first"?: boolean;
      };
    }
  }
}
