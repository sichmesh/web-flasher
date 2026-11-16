"use client";

import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  /** 0..1 — brightens the node for a moment after a signal reaches it. */
  glow: number;
}

/** A message hopping across the mesh from node to node. */
interface Signal {
  from: number;
  to: number;
  /** Progress along the current link, 0..1. */
  t: number;
  hops: number;
  maxHops: number;
  seen: Set<number>;
  /** Links already travelled: [from, to, opacity]. */
  trail: [number, number, number][];
  done: boolean;
}

interface Flash {
  node: number;
  t: number;
}

/**
 * Lightweight animated mesh network rendered on canvas.
 * Nodes drift slowly and connect with glowing lines when close. Signals hop
 * along those links from node to node, like a message relayed across the mesh.
 */
export default function NetworkCanvas({
  className = "",
  density = 0.00009,
  interactive = true,
  signals = 4,
  signalSpeed = 1,
}: {
  className?: string;
  density?: number;
  interactive?: boolean;
  /** Average number of signals travelling at once (0 disables them). */
  signals?: number;
  /** Signal travel speed, 1 = slow. */
  signalSpeed?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let nodes: Node[] = [];
    let packets: Signal[] = [];
    let flashes: Flash[] = [];
    let spawnAcc = 0;
    let last = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Pull the Gold + Night palette straight from the CSS variables so the
    // canvas stays in sync with the design system (gold nodes, steel links).
    const cs = getComputedStyle(document.documentElement);
    const channels = (name: string, fallback: string) =>
      (cs.getPropertyValue(name).trim() || fallback)
        .split(/\s+/)
        .map(Number);
    const [gr, gg, gb] = channels("--gold", "230 184 74");
    const [sr, sg, sb] = channels("--steel", "124 150 182");
    const gold = (o: number) => `rgba(${gr}, ${gg}, ${gb}, ${o})`;
    const steel = (o: number) => `rgba(${sr}, ${sg}, ${sb}, ${o})`;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const resize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(
        110,
        Math.max(28, Math.floor(w * h * density))
      );
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.6 + 0.6,
        glow: 0,
      }));
      // Old signals point at nodes that no longer exist
      packets = [];
      flashes = [];
    };

    const linkDist = 150;

    const neighbors = (i: number, skip: Set<number>) => {
      const a = nodes[i];
      const out: number[] = [];
      for (let j = 0; j < nodes.length; j++) {
        if (j === i || skip.has(j)) continue;
        const b = nodes[j];
        if (Math.hypot(a.x - b.x, a.y - b.y) < linkDist) out.push(j);
      }
      return out;
    };

    const spawn = () => {
      const i = Math.floor(Math.random() * nodes.length);
      const nb = neighbors(i, new Set());
      if (!nb.length) return;
      packets.push({
        from: i,
        to: nb[Math.floor(Math.random() * nb.length)],
        t: 0,
        hops: 0,
        maxHops: 3 + Math.floor(Math.random() * 5),
        seen: new Set([i]),
        trail: [],
        done: false,
      });
      nodes[i].glow = 1;
    };

    const stepSignals = (dt: number) => {
      for (const n of nodes) n.glow = Math.max(0, n.glow - dt * 1.6);

      const live = packets.filter((p) => !p.done).length;
      spawnAcc = Math.min(1.5, spawnAcc + dt * signals * 0.45);
      if (spawnAcc >= 1 && live < signals * 2) {
        spawn();
        spawnAcc -= 1;
      }

      for (const p of packets) {
        for (const tr of p.trail) tr[2] -= dt * 1.2;
        p.trail = p.trail.filter((tr) => tr[2] > 0);
        if (p.done) continue;

        const a = nodes[p.from];
        const b = nodes[p.to];
        const d = Math.max(20, Math.hypot(a.x - b.x, a.y - b.y));
        p.t += (dt * signalSpeed * 60) / d;
        if (p.t < 1) continue;

        // Arrived: light up the node and relay to an unvisited neighbour
        p.hops++;
        b.glow = 1;
        flashes.push({ node: p.to, t: 0 });
        p.seen.add(p.to);
        p.trail.push([p.from, p.to, 1]);
        const nb = p.hops >= p.maxHops ? [] : neighbors(p.to, p.seen);
        if (!nb.length) {
          p.done = true;
          continue;
        }
        p.from = p.to;
        p.to = nb[Math.floor(Math.random() * nb.length)];
        p.t = 0;
      }
      packets = packets.filter((p) => !p.done || p.trail.length);

      for (const f of flashes) f.t += dt;
      flashes = flashes.filter((f) => f.t < 0.7);
    };

    const drawSignals = () => {
      for (const p of packets) {
        for (const [f, t, o] of p.trail) {
          const a = nodes[f];
          const b = nodes[t];
          ctx.strokeStyle = gold(o * 0.55);
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
        if (p.done) continue;
        const a = nodes[p.from];
        const b = nodes[p.to];
        const x = a.x + (b.x - a.x) * p.t;
        const y = a.y + (b.y - a.y) * p.t;
        ctx.strokeStyle = gold(0.6);
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x, y, 2.4, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 236, 180, 1)";
        ctx.shadowBlur = 14;
        ctx.shadowColor = gold(1);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      for (const f of flashes) {
        const n = nodes[f.node];
        const k = f.t / 0.7;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 3 + k * 14, 0, Math.PI * 2);
        ctx.strokeStyle = gold((1 - k) * 0.6);
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    };

    const draw = (ts: number) => {
      const dt = Math.min(0.05, (ts - (last || ts)) / 1000);
      last = ts;
      ctx.clearRect(0, 0, w, h);

      for (const n of nodes) {
        if (!prefersReduced) {
          n.x += n.vx;
          n.y += n.vy;
        }
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }

      // connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < linkDist) {
            const o = (1 - dist / linkDist) * 0.32;
            ctx.strokeStyle = steel(o);
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // mouse links
      if (interactive) {
        for (const n of nodes) {
          const dx = n.x - mouse.current.x;
          const dy = n.y - mouse.current.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 200) {
            const o = (1 - dist / 200) * 0.5;
            ctx.strokeStyle = gold(o);
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(mouse.current.x, mouse.current.y);
            ctx.stroke();
          }
        }
      }

      // signals hopping between nodes
      if (signals > 0 && !prefersReduced) {
        stepSignals(dt);
        drawSignals();
      }

      // nodes
      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + n.glow * 1.6, 0, Math.PI * 2);
        ctx.fillStyle = gold(0.9);
        ctx.shadowBlur = 8 + n.glow * 14;
        ctx.shadowColor = gold(0.8);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      raf = requestAnimationFrame(draw);
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => {
      mouse.current = { x: -9999, y: -9999 };
    };

    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    if (interactive) {
      window.addEventListener("mousemove", onMove);
      canvas.addEventListener("mouseleave", onLeave);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, [density, interactive, signals, signalSpeed]);

  return <canvas ref={ref} className={className} aria-hidden />;
}
