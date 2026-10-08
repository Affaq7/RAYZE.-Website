"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";

interface PortfolioProject {
  num: string;
  title: string;
  gradient: string;
  categoryYear: string;
  story: string;
  deliverables: string[];
}

const PROJECTS: PortfolioProject[] = [
  {
    num: "01",
    title: "GLOW STUDIO",
    gradient: "linear-gradient(145deg, #ef2b36, #4a070c)",
    categoryYear: "Fashion & Beauty — 2026",
    story:
      "Redefined the digital aura, delivering +320% engagement and expanding omnichannel presence from first sketch to full launch.",
    deliverables: [
      "Social media management",
      "Content calendar",
      "Community growth",
      "Monthly reporting",
    ],
  },
  {
    num: "02",
    title: "EMBER KITCHEN",
    gradient: "linear-gradient(145deg, #0c0c0c, #d11a25)",
    categoryYear: "Restaurants & Culinary — 2026",
    story:
      "Captured the culinary fire and atmosphere in cinematic motion, brand identity, and packaging. Fully booked 6 weeks out.",
    deliverables: [
      "Logo design",
      "Brand identity",
      "Brand guidelines",
      "Packaging & collateral",
    ],
  },
  {
    num: "03",
    title: "PEAK GYM",
    gradient: "linear-gradient(145deg, #8a1019, #0c0c0c)",
    categoryYear: "Fitness & Performance — 2025",
    story:
      "Built a high-intensity content pipeline that drove record memberships and turned casual gymgoers into an obsessed community.",
    deliverables: [
      "Video editing",
      "Motion graphics",
      "Short-form reels",
      "Platform-ready exports",
    ],
  },
  {
    num: "04",
    title: "HAVEN HOMES",
    gradient: "linear-gradient(145deg, #ff4048, #2a0508)",
    categoryYear: "Real Estate & Architecture — 2025",
    story:
      "Produced luxury digital architectural showcases that elevated buyer perception and scaled inbound high-net-worth inquiries.",
    deliverables: [
      "Website design",
      "Responsive development",
      "Lead capture flow",
      "Launch & optimisation",
    ],
  },
  {
    num: "05",
    title: "NOVA STORE",
    gradient: "linear-gradient(145deg, #0c0c0c, #e4202c)",
    categoryYear: "Tech & E-Commerce — 2025",
    story:
      "Engineered an automated digital shopping experience with zero-friction checkout, increasing average order value by +42%.",
    deliverables: [
      "Brand design",
      "Website",
      "Workflow automations",
      "CRM integration",
    ],
  },
  {
    num: "06",
    title: "LEARNLY",
    gradient: "linear-gradient(145deg, #b3151f, #120305)",
    categoryYear: "Education & EdTech — 2024",
    story:
      "Crafted a bold educational platform identity and animated social campaigns that made online learning feel electric.",
    deliverables: [
      "Logo & identity",
      "Social media strategy",
      "Animated brand assets",
      "Campaign content",
    ],
  },
];

const STATS_DATA = [
  { target: 120, suffix: "+", label: "Campaigns" },
  { target: 40, suffix: "+", label: "Brands grown" },
  { target: 3, suffix: "x", label: "Avg. engagement" },
];

export function SelectedWork() {
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const statsSectionRef = useRef<HTMLDivElement>(null);

  const [activeIdx, setActiveIdx] = useState(0);
  const [stats, setStats] = useState([0, 0, 0]);
  const [isRevealed, setIsRevealed] = useState(false);

  const dragRef = useRef<{ x: number; i: number; m: boolean } | null>(null);
  const isHoveredRef = useRef(false);

  const n = PROJECTS.length;

  const off = useCallback(
    (i: number, a: number, total: number) => {
      const r = i - a;
      const l = r > 0 ? r - total : r + total;
      return Math.abs(l) < Math.abs(r) ? l : r;
    },
    []
  );

  const lay = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const W = stage.clientWidth;
    const mob = W < 700;
    const cw = Math.min(520, W * (mob ? 0.74 : 0.7));
    const m = mob ? 1 : 2;
    const sp = cw * (mob ? 0.5 : 0.55);
    const dg2 = mob ? 9 : 14;

    stage.style.setProperty("--cw", `${cw}px`);
    stage.style.setProperty("--ch", `${cw * (mob ? 1.25 : 0.66)}px`);

    cardRefs.current.forEach((c, i) => {
      if (!c) return;
      const o = off(i, activeIdx, n);
      const ab = Math.abs(o);
      const act = o === 0;

      c.style.transition = "";
      if (act) {
        c.classList.add("act");
      } else {
        c.classList.remove("act");
      }

      if (ab > m) {
        c.style.opacity = "0";
        c.style.pointerEvents = "none";
        const t = `translateX(${o * sp}px) scale(.8)`;
        c.style.transform = t;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (c as any)._t = t;
        return;
      }

      c.style.opacity = act ? "1" : "0.92";
      c.style.pointerEvents = "auto";
      c.style.zIndex = `${10 - ab}`;
      const t = `translateX(${o * sp}px) translateY(${
        ab * 12 - (act ? 26 : 0)
      }px) translateZ(${-ab * 150}px) rotateZ(${o * dg2}deg) rotateX(${
        act ? 0 : 12
      }deg) scale(${act ? 1.03 : 0.93})`;
      c.style.transform = t;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (c as any)._t = t;
    });
  }, [activeIdx, n, off]);

  const go = useCallback(
    (i: number) => {
      const target = ((i % n) + n) % n;
      setActiveIdx(target);
    },
    [n]
  );

  // Update layout when activeIdx changes
  useEffect(() => {
    lay();
  }, [activeIdx, lay]);

  // Handle window resize
  useEffect(() => {
    window.addEventListener("resize", lay);
    return () => window.removeEventListener("resize", lay);
  }, [lay]);

  // Auto-advance
  useEffect(() => {
    if (typeof window === "undefined") return;
    const isReduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (isReduce) return;

    const interval = setInterval(() => {
      if (!isHoveredRef.current && !dragRef.current) {
        go(activeIdx + 1);
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [activeIdx, go]);

  // Counting stats on scroll
  useEffect(() => {
    const el = statsSectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          const start = performance.now();
          const duration = 1400;

          const step = (now: number) => {
            const elapsed = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - elapsed, 3);
            setStats(STATS_DATA.map((s) => Math.round(s.target * ease)));

            if (elapsed < 1) {
              requestAnimationFrame(step);
            }
          };

          requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(activeIdx - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      go(activeIdx + 1);
    }
  };

  // Pointer drag gestures
  const handlePointerDown = (e: React.PointerEvent, i: number) => {
    if ((e.target as HTMLElement).closest(".ar")) return;
    dragRef.current = { x: e.clientX, i, m: false };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent, i: number) => {
    if (!dragRef.current || dragRef.current.i !== i || i !== activeIdx) return;
    const dx = e.clientX - dragRef.current.x;
    if (Math.abs(dx) > 6) {
      dragRef.current.m = true;
      const c = e.currentTarget as HTMLElement;
      c.style.transition = "none";
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      c.style.transform = `${(c as any)._t} translateX(${dx * 0.6}px)`;
    }
  };

  const handlePointerUp = (e: React.PointerEvent, i: number) => {
    if ((e.target as HTMLElement).closest(".ar")) return;
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.x;
    const d = dragRef.current;
    dragRef.current = null;

    if (i === activeIdx && Math.abs(dx) > 50) {
      go(activeIdx + (dx < 0 ? 1 : -1));
    } else if (i !== activeIdx && !d.m) {
      go(i);
    } else {
      lay();
    }
  };

  const handlePointerCancel = () => {
    dragRef.current = null;
    lay();
  };

  return (
    <>
      {/* ── Section: Selected Work Portfolio with Stats ── */}
      <section className="selected-work-sec" id="work" ref={statsSectionRef}>
        <div className="w">
          {/* Header matching user's spec */}
          <div className="lbl rv on">SELECTED WORK</div>
          <h2 className="rv on">
            BRANDS WE&apos;VE
            <br />
            HELPED RISE<span className="red">.</span>
          </h2>
          <p className="txt rv on">
            A look at the companies we&apos;ve worked with, from first sketch to
            full launch. Swipe through and see what we built together.
          </p>

          {/* Stats bar */}
          <div className="work-stats-grid" style={{ marginTop: "40px", marginBottom: "20px" }}>
            {STATS_DATA.map((st, i) => (
              <div
                key={st.label}
                className={`work-stat-col work-rv ${isRevealed ? "in" : ""}`}
              >
                <b>
                  <span>{stats[i]}</span>
                  <s>{st.suffix}</s>
                </b>
                <p>{st.label}</p>
              </div>
            ))}
          </div>

          {/* 3D Arc Stage matching user's HTML code */}
          <div
            id="svs"
            ref={stageRef}
            className="svs rv on"
            tabIndex={0}
            role="region"
            aria-label="RAYZE portfolio"
            onKeyDown={handleKeyDown}
            onMouseEnter={() => {
              isHoveredRef.current = true;
            }}
            onMouseLeave={() => {
              isHoveredRef.current = false;
            }}
            onFocus={() => {
              isHoveredRef.current = true;
            }}
            onBlur={() => {
              isHoveredRef.current = false;
            }}
          >
            {PROJECTS.map((proj, i) => (
              <div
                key={proj.num}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className={`sc ${i === activeIdx ? "act" : ""}`}
                style={
                  {
                    "--g": proj.gradient,
                  } as React.CSSProperties
                }
                onClick={(e) => {
                  if ((e.target as HTMLElement).closest(".ar")) return;
                  if (i !== activeIdx) go(i);
                }}
                onPointerDown={(e) => handlePointerDown(e, i)}
                onPointerMove={(e) => handlePointerMove(e, i)}
                onPointerUp={(e) => handlePointerUp(e, i)}
                onPointerCancel={handlePointerCancel}
              >
                {/* 3 interlocking white line ovals watermark */}
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
                <i className="gl" />

                {/* Top: number and arrow button */}
                <div className="tp">
                  <span className="sn">{proj.num}</span>
                  <Link
                    href="/work"
                    className="ar"
                    aria-label={`View ${proj.title} in work section`}
                    onPointerDown={(e) => e.stopPropagation()}
                    onPointerUp={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    ↗
                  </Link>
                </div>

                {/* Bottom: title & expandable drawer */}
                <div className="bt">
                  <h3>{proj.title}</h3>
                  <div className="x">
                    <b>{proj.categoryYear}</b>
                    <p>{proj.story}</p>
                    <ul>
                      {proj.deliverables.map((d, dIdx) => (
                        <li key={dIdx}>{d}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Controls: prev, dots, next */}
          <div className="svc">
            <button
              id="sb"
              type="button"
              aria-label="Previous project"
              onClick={() => go(activeIdx - 1)}
            >
              ←
            </button>
            <div className="sd" id="sd" role="tablist">
              {PROJECTS.map((proj, i) => (
                <button
                  key={proj.num}
                  type="button"
                  className={i === activeIdx ? "on" : ""}
                  aria-label={`Go to ${proj.title}`}
                  aria-selected={i === activeIdx}
                  role="tab"
                  onClick={() => go(i)}
                />
              ))}
            </div>
            <button
              id="sf"
              type="button"
              aria-label="Next project"
              onClick={() => go(activeIdx + 1)}
            >
              →
            </button>
          </div>

          {/* Counter display: 01 / 06 — GLOW STUDIO */}
          <div className="sct" id="sct" aria-live="polite">
            {PROJECTS[activeIdx].num} / 0{n} — {PROJECTS[activeIdx].title}
          </div>
        </div>
      </section>
    </>
  );
}

export default SelectedWork;
