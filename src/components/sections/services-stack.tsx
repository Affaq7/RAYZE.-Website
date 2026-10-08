"use client";

import React, { useEffect, useRef, useCallback } from "react";
import Link from "next/link";

interface ServiceItem {
  n: string;
  t: string;
  f: string;
  w: string[];
  g: string;
}

const servicesData: ServiceItem[] = [
  {
    n: "Social Media",
    t: "Strategy",
    f: "(01)",
    w: ["Content", "Strategy", "Community", "Reporting"],
    g: "#ef2b36,#4a070c",
  },
  {
    n: "Logo Design",
    t: "Identity",
    f: "(02)",
    w: ["Creative", "Direction", "Logo", "Systems"],
    g: "#0c0c0c,#d11a25",
  },
  {
    n: "Brand Design",
    t: "Systems",
    f: "(03)",
    w: ["Visual", "Identity", "Type & Colour", "Guidelines"],
    g: "#8a1019,#0c0c0c",
  },
  {
    n: "Video & Animation",
    t: "Motion",
    f: "(04)",
    w: ["Editing", "Motion", "Graphics", "Exports"],
    g: "#ff4048,#2a0508",
  },
  {
    n: "Website",
    t: "Build",
    f: "(05)",
    w: ["UX", "Design", "Development", "Launch"],
    g: "#0c0c0c,#e4202c",
  },
  {
    n: "Automations",
    t: "Integration",
    f: "(06)",
    w: ["Workflows", "CRM", "Integrations", "Testing"],
    g: "#b3151f,#120305",
  },
];

export function ServicesStack() {
  const listRef = useRef<HTMLUListElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const thRef = useRef<HTMLDivElement>(null);
  const curRef = useRef<HTMLDivElement>(null);
  const liRefs = useRef<(HTMLLIElement | null)[]>([]);
  const thRefs = useRef<(HTMLDivElement | null)[]>([]);

  const activeIndexRef = useRef(0);
  const lastIndexRef = useRef(-1);
  const hoverRef = useRef(false);
  const prevTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const lay = useCallback((activeIdx: number) => {
    const L = listRef.current;
    const W = wheelRef.current;
    const els = liRefs.current;
    if (!L || !W || !els[0]) return;

    const h = els[0].offsetHeight;
    const H = W.clientHeight;
    L.style.transform = `translateY(${H / 2 - (activeIdx * h + h / 2)}px)`;

    els.forEach((e, k) => {
      if (!e) return;
      const d = Math.abs(k - activeIdx);
      e.className = k === activeIdx ? "on" : "";
      e.style.setProperty("--o", String(Math.max(0.1, 0.3 - d * 0.05)));
    });
  }, []);

  const setService = useCallback(
    (i: number) => {
      const a = activeIndexRef.current;
      const last = lastIndexRef.current;
      if (i === a && last !== -1) return;

      const p = last;
      activeIndexRef.current = i;
      lastIndexRef.current = i;

      lay(i);

      const ths = thRefs.current;
      ths.forEach((t, k) => {
        if (!t) return;
        t.classList.remove("prev");
        if (k === p && k !== i) t.classList.add("prev");
        t.classList.toggle("on", k === i);
      });

      if (prevTimeoutRef.current) clearTimeout(prevTimeoutRef.current);
      prevTimeoutRef.current = setTimeout(() => {
        ths.forEach((t, k) => {
          if (!t) return;
          if (k !== activeIndexRef.current) t.classList.remove("prev");
        });
      }, 750);
    },
    [lay]
  );

  useEffect(() => {
    const n = servicesData.length;

    // Initial setup
    setService(0);

    const onResize = () => {
      lay(activeIndexRef.current);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") setService((activeIndexRef.current + 1) % n);
      if (e.key === "ArrowUp") setService((activeIndexRef.current - 1 + n) % n);
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKeyDown);

    // Auto-advance
    let intervalId: NodeJS.Timeout | null = null;
    const isReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!isReduced) {
      intervalId = setInterval(() => {
        if (!hoverRef.current) {
          setService((activeIndexRef.current + 1) % n);
        }
      }, 2400);
    }

    // Custom cursor follower
    const cu = curRef.current;
    let mx = 0,
      my = 0,
      cx = 0,
      cy = 0;
    let animId: number | null = null;
    let moved = false;

    const onPointerMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (!moved) {
        cx = mx;
        cy = my;
        moved = true;
      }
      if (cu) cu.style.opacity = "1";
    };

    const onMouseLeave = () => {
      if (cu) cu.style.opacity = "0";
    };

    window.addEventListener("pointermove", onPointerMove);
    document.addEventListener("mouseleave", onMouseLeave);

    const renderCursor = () => {
      cx += (mx - cx) * 0.18;
      cy += (my - cy) * 0.18;
      if (cu) {
        cu.style.transform = `translate(${cx}px, ${cy}px)`;
      }
      animId = requestAnimationFrame(renderCursor);
    };
    animId = requestAnimationFrame(renderCursor);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      if (intervalId) clearInterval(intervalId);
      if (animId) cancelAnimationFrame(animId);
      if (prevTimeoutRef.current) clearTimeout(prevTimeoutRef.current);
    };
  }, [lay, setService]);

  return (
    <>
      <section className="services-wheel-section" id="services" aria-label="Services">
        {/* Top meta bar */}
        <div className="m">
          <div>
            <span className="dot" aria-hidden="true" />
            <span>Services</span>
          </div>
          <div>
            <span>Rise with RAYZE.</span>
          </div>
        </div>

        {/* Middle kinetic wheel & card */}
        <div className="mid">
          <div className="th" id="th" ref={thRef}>
            {servicesData.map((d, i) => (
              <div
                key={d.n}
                ref={(el) => {
                  thRefs.current[i] = el;
                }}
                style={{
                  ["--g" as string]: d.g,
                }}
              >
                <svg
                  viewBox="0 0 600 300"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2.5"
                  aria-hidden="true"
                >
                  <ellipse cx="170" cy="150" rx="110" ry="140" />
                  <ellipse cx="300" cy="150" rx="110" ry="140" />
                  <ellipse cx="430" cy="150" rx="110" ry="140" />
                </svg>
                {d.w.map((x) => (
                  <i key={x}>{x}</i>
                ))}
              </div>
            ))}
          </div>

          <div
            className="wheel"
            id="wh"
            ref={wheelRef}
            onMouseLeave={() => {
              hoverRef.current = false;
            }}
          >
            <ul className="list" id="list" ref={listRef}>
              {servicesData.map((d, i) => (
                <li
                  key={d.n}
                  ref={(el) => {
                    liRefs.current[i] = el;
                  }}
                  onMouseEnter={() => {
                    hoverRef.current = true;
                    setService(i);
                  }}
                  onClick={() => setService(i)}
                >
                  <span>
                    {d.n}
                    <small>{d.t}</small>
                    <small className="f">{d.f}</small>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom meta bar */}
        <div className="m bt">
          <span>(06) Integrated Disciplines</span>
          <Link href="/services" className="all">
            View All Services ↗
          </Link>
        </div>
      </section>

      {/* Red Cursor Follower */}
      <div ref={curRef} className="cur" id="cur" aria-hidden="true" />
    </>
  );
}

export default ServicesStack;
