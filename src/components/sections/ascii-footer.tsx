"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";

interface Cell {
  col: number;
  row: number;
  ch: string;
  end: number;
}

interface Hand {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  cells: Record<string, Cell>;
  list: Cell[];
  rows: number;
  bo: number;
}

export function AsciiFooter() {
  const rootRef = useRef<HTMLElement>(null);
  const leftCanvasRef = useRef<HTMLCanvasElement>(null);
  const rightCanvasRef = useRef<HTMLCanvasElement>(null);
  const leftWrapRef = useRef<HTMLDivElement>(null);
  const rightWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvasL = leftCanvasRef.current;
    const canvasR = rightCanvasRef.current;
    const wl = leftWrapRef.current;
    const wr = rightWrapRef.current;

    if (!root || !canvasL || !canvasR || !wl || !wr) return;

    const COLS = 72;
    const CS = 14;
    const FS = 12;
    const CH = "........:::=+xX#0369";
    const LIFE = 300;
    const CL = 10;
    const EASE = 0.05;
    const RAD = 8;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const STR = reduce ? 0 : 20;

    const wrArray = [wl, wr];
    const hands: Hand[] = [];
    const col = {
      c: "#cf2833",
      h: "#e4202c",
      hc: "#0b0b0b",
    };

    const chars = Array.from(root.querySelectorAll<HTMLElement>(".ch"));
    const rise = root.querySelector<HTMLElement>(".af-rise");

    function rc() {
      if (!root) return;
      const s = getComputedStyle(root);
      col.c = s.getPropertyValue("--ac").trim() || "#cf2833";
      col.h = s.getPropertyValue("--hv").trim() || "#e4202c";
      col.hc = s.getPropertyValue("--hc").trim() || "#0b0b0b";
    }
    rc();

    function tube(g: CanvasRenderingContext2D, f: () => void) {
      const passes: [number, string][] = [
        [40, "#c4c4c4"],
        [32, "#8c8c8c"],
        [22, "#4a4a4a"],
        [11, "#000"],
      ];
      passes.forEach(([lw, color]) => {
        g.lineWidth = lw;
        g.strokeStyle = color;
        f();
      });
    }

    function artL(g: CanvasRenderingContext2D) {
      g.lineCap = "round";
      [0, 1, 2].forEach((i) => {
        tube(g, () => {
          g.beginPath();
          g.ellipse(125 + i * 75, 150, 62, 108, (i - 1) * 0.14, 0, Math.PI * 2);
          g.stroke();
        });
      });
    }

    function artR(g: CanvasRenderingContext2D) {
      const x = 200;
      const y = 300;
      const r = g.createRadialGradient(x, y, 6, x, y, 125);
      r.addColorStop(0, "#000");
      r.addColorStop(0.6, "#555");
      r.addColorStop(1, "#bbb");
      g.fillStyle = r;
      g.beginPath();
      g.arc(x, y, 125, Math.PI, 0);
      g.fill();
      g.lineCap = "round";

      for (let i = 0; i < 9; i++) {
        const a = Math.PI + 0.2 + (i * (Math.PI - 0.4)) / 8;
        const L = i % 2 ? 175 : 205;
        tube(g, () => {
          g.beginPath();
          g.moveTo(x + Math.cos(a) * 150, y + Math.sin(a) * 150);
          g.lineTo(x + Math.cos(a) * L, y + Math.sin(a) * L);
          g.stroke();
        });
      }
    }

    function setup(
      canvas: HTMLCanvasElement,
      art: (g: CanvasRenderingContext2D) => void
    ) {
      const src = document.createElement("canvas");
      src.width = 400;
      src.height = 300;
      const g = src.getContext("2d");
      if (!g) return;
      g.fillStyle = "#fff";
      g.fillRect(0, 0, 400, 300);
      art(g);

      const rows = Math.round(COLS / (400 / 300));
      const sm = document.createElement("canvas");
      sm.width = COLS;
      sm.height = rows;
      const sg = sm.getContext("2d");
      if (!sg) return;
      sg.drawImage(src, 0, 0, COLS, rows);

      const px = sg.getImageData(0, 0, COLS, rows).data;
      const bg = CH.lastIndexOf(".");
      const cells: Record<string, Cell> = {};
      const list: Cell[] = [];

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < COLS; c++) {
          const o = (r * COLS + c) * 4;
          const b =
            (px[o] * 0.299 + px[o + 1] * 0.587 + px[o + 2] * 0.114) / 255;
          const i = Math.min(CH.length - 1, Math.floor((1 - b) * CH.length));
          if (i <= bg) continue;
          const cell: Cell = { col: c, row: r, ch: CH[i], end: 0 };
          cells[c + "," + r] = cell;
          list.push(cell);
        }
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = COLS * CS * dpr;
      canvas.height = rows * CS * dpr;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = FS + "px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";

      const m = ctx.measureText("X");
      const gh = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
      const bo = CS / 2 + gh / 2 - m.actualBoundingBoxDescent;
      hands.push({ canvas, ctx, cells, list, rows, bo });
    }

    setup(canvasL, artL);
    setup(canvasR, artR);

    function draw(h: Hand, now: number) {
      const x = h.ctx;
      x.clearRect(0, 0, COLS * CS, h.rows * CS);
      for (let i = 0; i < h.list.length; i++) {
        const c = h.list[i];
        const on = c.end > now;
        if (on) {
          x.shadowColor = col.h;
          x.shadowBlur = 14;
          x.fillStyle = col.h;
          x.fillRect(c.col * CS, c.row * CS, CS, CS);
          x.shadowBlur = 0;
        }
        x.fillStyle = on ? col.hc : col.c;
        x.fillText(c.ch, c.col * CS + CS / 2, c.row * CS + h.bo);
      }
    }

    function cluster(h: Hand, s: Cell) {
      const now = Date.now();
      s.end = now + LIFE;
      const lit = [s];
      let curCell = s;
      const n = Math.floor(Math.random() * CL) + 1;
      for (let k = 0; k < n; k++) {
        const nb: Cell[] = [];
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (!dx && !dy) continue;
            const c = h.cells[curCell.col + dx + "," + (curCell.row + dy)];
            if (c && lit.indexOf(c) < 0) nb.push(c);
          }
        }
        if (!nb.length) break;
        const nx = nb[Math.floor(Math.random() * nb.length)];
        nx.end = now + LIFE + k * 10;
        lit.push(nx);
        curCell = nx;
      }
    }

    function hover(h: Hand, cx: number, cy: number) {
      const r = h.canvas.getBoundingClientRect();
      if (!r.width) return;
      const mc = ((cx - r.left) / r.width) * COLS;
      const mr = ((cy - r.top) / r.height) * h.rows;
      let best: Cell | null = null;
      let bd = 1e9;
      for (let dy = -RAD; dy <= RAD; dy++) {
        for (let dx = -RAD; dx <= RAD; dx++) {
          const c = h.cells[Math.round(mc) + dx + "," + (Math.round(mr) + dy)];
          if (!c) continue;
          const d = Math.hypot(mc - c.col, mr - c.row);
          if (d < bd) {
            bd = d;
            best = c;
          }
        }
      }
      if (best && bd <= RAD) cluster(h, best);
    }

    const ptr = { x: 0, y: 0 };
    const dr = { x: 0, y: 0 };
    const cur = { o: 125 };

    const handlePointerMove = (e: PointerEvent) => {
      if (!root) return;
      const r = root.getBoundingClientRect();
      root.style.setProperty("--mx", e.clientX - r.left + "px");
      root.style.setProperty("--my", e.clientY - r.top + "px");
      ptr.x = ((e.clientX - r.left) / (r.width || 1) - 0.5) * STR * 2;
      ptr.y = ((e.clientY - r.top) / (r.height || 1) - 0.5) * STR * 2;
      hands.forEach((h) => hover(h, e.clientX, e.clientY));
    };

    if (!reduce) {
      window.addEventListener("pointermove", handlePointerMove);
    }

    let animId: number;
    let lastT = 0;

    function frame() {
      const now = Date.now();
      if (!reduce && now - lastT > 110) {
        lastT = now;
        hands.forEach((h) => {
          if (h.list.length > 0) {
            cluster(h, h.list[Math.floor(Math.random() * h.list.length)]);
          }
        });
      }
      hands.forEach((h) => draw(h, now));

      dr.x += (ptr.x - dr.x) * EASE;
      dr.y += (ptr.y - dr.y) * EASE;
      const sc = 1 + (STR * 2) / 200;

      wrArray.forEach((w, i) => {
        if (!w) return;
        const d = i ? -1 : 1;
        const rx = i ? cur.o : -cur.o;
        w.style.transform = `translateX(${rx}%) translate(${
          (dr.x * d) || 0
        }px,${-dr.y || 0}px) scale(${sc})`;
      });

      animId = requestAnimationFrame(frame);
    }

    animId = requestAnimationFrame(frame);

    function show() {
      cur.o = 0;
      if (chars.length > 0) {
        gsap.set(chars, { yPercent: 0 });
      }
      if (rise) {
        gsap.set(rise, { opacity: 1, y: 0 });
      }
    }

    let observer: IntersectionObserver | null = null;

    if (reduce) {
      show();
    } else {
      if (chars.length > 0) {
        gsap.set(chars, { yPercent: 125 });
      }
      if (rise) {
        gsap.set(rise, { opacity: 0, y: 24 });
      }

      let shown = false;
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting && !shown) {
              shown = true;
              gsap.to(cur, {
                o: 0,
                duration: 1.1,
                ease: "power3.out",
                overwrite: true,
              });
              if (chars.length > 0) {
                gsap.to(chars, {
                  yPercent: 0,
                  duration: 1,
                  ease: "power3.out",
                  stagger: { each: 0.05, from: "center" },
                  overwrite: true,
                });
              }
              if (rise) {
                gsap.to(rise, {
                  opacity: 1,
                  y: 0,
                  duration: 0.9,
                  delay: 0.35,
                  ease: "power3.out",
                  overwrite: true,
                });
              }
            } else if (!e.isIntersecting && shown) {
              shown = false;
              gsap.to(cur, {
                o: 125,
                duration: 0.4,
                ease: "power2.in",
                overwrite: true,
              });
              if (chars.length > 0) {
                gsap.to(chars, {
                  yPercent: 125,
                  duration: 0.4,
                  ease: "power2.in",
                  stagger: { each: 0.01, from: "center" },
                  overwrite: true,
                });
              }
              if (rise) {
                gsap.to(rise, {
                  opacity: 0,
                  y: 24,
                  duration: 0.3,
                  overwrite: true,
                });
              }
            }
          });
        },
        { threshold: 0.35 }
      );

      observer.observe(root);
    }

    return () => {
      cancelAnimationFrame(animId);
      if (!reduce) {
        window.removeEventListener("pointermove", handlePointerMove);
      }
      if (observer) {
        observer.disconnect();
      }
      gsap.killTweensOf(cur);
      if (chars.length > 0) gsap.killTweensOf(chars);
      if (rise) gsap.killTweensOf(rise);
    };
  }, []);

  return (
    <footer id="af" ref={rootRef} aria-label="RAYZE">
      <div className="glow" />

      <div className="hands">
        <div
          className="hw"
          id="wl"
          ref={leftWrapRef}
          style={{ transform: "translateX(-125%)" }}
        >
          <canvas id="cl" ref={leftCanvasRef} aria-hidden="true" />
        </div>
        <div
          className="hw"
          id="wr"
          ref={rightWrapRef}
          style={{ transform: "translateX(125%)" }}
        >
          <canvas id="cr" ref={rightCanvasRef} aria-hidden="true" />
        </div>
      </div>

      <div className="mid af-rise">
        <div className="eyebrow">READY TO RISE?</div>
        <p className="serif">Let&apos;s build something worth remembering.</p>
        <Link className="af-cta" href="/contact">
          Start a project <b>↗</b>
        </Link>
      </div>

      <div className="big">
        <h2 aria-label="RAYZE.">
          <span className="ch" aria-hidden="true">
            R
          </span>
          <span className="ch" aria-hidden="true">
            A
          </span>
          <span className="ch" aria-hidden="true">
            Y
          </span>
          <span className="ch" aria-hidden="true">
            Z
          </span>
          <span className="ch" aria-hidden="true">
            E
          </span>
          <span className="ch red" aria-hidden="true">
            .
          </span>
        </h2>
      </div>

      <div className="grain" />

      <div className="fine">
        <span>© 2026 RAYZE.</span>
        <nav>
          <a
            href="https://www.instagram.com/rayze.studio/"
            target="_blank"
            rel="noopener noreferrer"
          >
            INSTAGRAM
          </a>
          <a
            href="https://www.linkedin.com/company/workwithrayze"
            target="_blank"
            rel="noopener noreferrer"
          >
            LINKEDIN
          </a>
          <a
            href="https://www.facebook.com/share/19h7SSKu4j/"
            target="_blank"
            rel="noopener noreferrer"
          >
            FACEBOOK
          </a>
          <a
            href="https://www.tiktok.com/@rayze.co"
            target="_blank"
            rel="noopener noreferrer"
          >
            TIKTOK
          </a>
        </nav>
        <a href="mailto:workwithrayze@gmail.com">workwithrayze@gmail.com</a>
      </div>
    </footer>
  );
}

export default AsciiFooter;
