import SparkMD5 from "spark-md5";

/**
 * Flashing over Web Serial with esptool-js (Espressif's own JavaScript port of
 * esptool). The firmware is described by an esp-web-tools style manifest:
 *
 *   { "name": "SICH", "version": "2.0.0",
 *     "builds": [{ "chipFamily": "ESP32-S3",
 *                  "parts": [{ "path": "firmware.factory.bin", "offset": 0 }] }] }
 *
 * Part paths are relative to the manifest file.
 */

export type Phase = "connect" | "erase" | "write" | "verify" | "done";

type Manifest = {
  name?: string;
  version?: string;
  builds: { chipFamily: string; parts: { path: string; offset: number }[] }[];
};

export type FlashOptions = {
  manifestUrl: string;
  /** Wipe the whole flash first (clean install). Otherwise only the firmware is rewritten. */
  eraseAll: boolean;
  onPhase: (phase: Phase) => void;
  /** 0..1 over all parts */
  onProgress: (fraction: number) => void;
  onLog: (line: string) => void;
};

const md5 = (image: Uint8Array) => {
  const buf = image.buffer.slice(image.byteOffset, image.byteOffset + image.byteLength) as ArrayBuffer;
  return SparkMD5.ArrayBuffer.hash(buf);
};

export async function flash(opts: FlashOptions): Promise<void> {
  const { ESPLoader, Transport } = await import("esptool-js");
  const log = (s: string) => s.trim() && opts.onLog(s.trim());

  // 1. Firmware files (fetched before asking for the port, so a missing file
  //    fails before anything touches the device)
  const manifestUrl = new URL(opts.manifestUrl, window.location.href);
  const manifest: Manifest = await fetch(manifestUrl).then((r) => {
    if (!r.ok) throw new Error(`manifest: HTTP ${r.status}`);
    return r.json();
  });

  // 2. Port + chip
  opts.onPhase("connect");
  const port = await navigator.serial.requestPort();
  const transport = new Transport(port, false);
  const loader = new ESPLoader({
    transport,
    baudrate: 921600,
    terminal: { clean() {}, writeLine: log, write: log },
  });

  try {
    const chipDesc = await loader.main();
    log(`chip: ${chipDesc}`);
    const chipName = loader.chip.CHIP_NAME;
    const build = manifest.builds.find((b) => b.chipFamily.toUpperCase() === chipName.toUpperCase());
    if (!build) {
      const wanted = manifest.builds.map((b) => b.chipFamily).join(", ");
      throw new Error(`This firmware is for ${wanted}, but the connected chip is ${chipName}.`);
    }

    const files = await Promise.all(
      build.parts.map(async (p) => {
        const r = await fetch(new URL(p.path, manifestUrl));
        if (!r.ok) throw new Error(`${p.path}: HTTP ${r.status}`);
        return { data: new Uint8Array(await r.arrayBuffer()), address: p.offset };
      })
    );
    const total = files.reduce((n, f) => n + f.data.length, 0);
    const before = files.map((_, i) => files.slice(0, i).reduce((n, f) => n + f.data.length, 0));

    // 3. Erase (clean install only)
    if (opts.eraseAll) {
      opts.onPhase("erase");
      log("erasing the whole flash…");
      await loader.eraseFlash();
    }

    // 4. Write; esptool-js checks every part's MD5 against the chip after writing
    opts.onPhase("write");
    let verifying = false;
    await loader.writeFlash({
      fileArray: files,
      flashMode: "keep",
      flashFreq: "keep",
      flashSize: "keep",
      eraseAll: false,
      compress: true,
      calculateMD5Hash: md5,
      reportProgress: (i, written, size) => {
        opts.onProgress(Math.min(1, (before[i] + (written / size) * files[i].data.length) / total));
        if (!verifying && i === files.length - 1 && written >= size) {
          verifying = true;
          opts.onPhase("verify");
        }
      },
    });

    // 5. Restart into the new firmware
    log("rebooting…");
    await loader.after("hard_reset");
    opts.onPhase("done");
  } finally {
    await transport.disconnect().catch(() => {});
  }
}
