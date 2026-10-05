"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

interface ServiceItem {
  num: string;
  title: string;
  tagline: string;
  description: string;
  delivCol1: string[];
  delivCol2: string[];
  gradient: string;
}

const servicesData: ServiceItem[] = [
  {
    num: "01",
    title: "SOCIAL MEDIA MANAGEMENT",
    tagline: "A presence with a point of view.",
    description:
      "Give your brand a consistent voice in a fast-moving feed. We connect planning, creation and community around what your audience cares about.",
    delivCol1: ["Content strategy & calendars", "Platform strategy"],
    delivCol2: ["Community management", "Reporting & recommendations"],
    gradient: "linear-gradient(145deg, #e5232e 0%, #4a070c 100%)",
  },
  {
    num: "02",
    title: "LOGO DESIGN",
    tagline: "A mark worth remembering.",
    description:
      "Turn the essence of your business into a distinctive, versatile mark, designed to hold its own from a profile picture to a shopfront.",
    delivCol1: ["Creative direction", "Primary & secondary marks"],
    delivCol2: ["Logo systems & collateral", "Final assets & digital files"],
    gradient: "linear-gradient(145deg, #180305 0%, #cb1b26 100%)",
  },
  {
    num: "03",
    title: "BRAND DESIGN",
    tagline: "Make every touchpoint feel like you.",
    description:
      "Build an identity that works as a whole: the right type, colour and direction, applied consistently across every channel.",
    delivCol1: ["Visual identity system", "Brand applications"],
    delivCol2: ["Typography & colour", "Brand guidelines"],
    gradient: "linear-gradient(145deg, #8a1019 0%, #160406 100%)",
  },
  {
    num: "04",
    title: "VIDEO EDITING & ANIMATION",
    tagline: "Ideas, set in motion.",
    description:
      "Raw footage and concepts become cinematic, scroll-stopping stories that give your brand movement and energy.",
    delivCol1: ["Short-form & long-form editing", "Animated brand assets"],
    delivCol2: ["Motion graphics", "Platform-ready exports"],
    gradient: "linear-gradient(145deg, #ea2c37 0%, #2a0508 100%)",
  },
  {
    num: "05",
    title: "WEBSITE",
    tagline: "Your brand. Built to work.",
    description:
      "Create a digital home that connects strong design with clear journeys: responsive, accessible and built to turn visitors into leads.",
    delivCol1: ["UX & structure design", "Content management"],
    delivCol2: ["Responsive development", "Launch & optimisation"],
    gradient: "linear-gradient(145deg, #b81722 0%, #120305 100%)",
  },
  {
    num: "06",
    title: "AUTOMATIONS",
    tagline: "Less repetition. More possibility.",
    description:
      "Connect the tools and tasks behind your business. We map repetitive workflows and build practical systems that keep the work moving.",
    delivCol1: ["Workflow mapping", "Lead & ops workflows"],
    delivCol2: ["Tool & CRM integrations", "Testing & documentation"],
    gradient: "linear-gradient(145deg, #99131c 0%, #0a0203 100%)",
  },
];

function getOffset(i: number, active: number, n: number) {
  const r = i - active;
  const l = r > 0 ? r - n : r + n;
  return Math.abs(l) < Math.abs(r) ? l : r;
}

function calculateCardStyle(
  i: number,
  active: number,
  n: number,
  isMobile: boolean
): React.CSSProperties {
  const o = getOffset(i, active, n);
  const isAct = o === 0;

  if (isMobile) {
    // Mobile layout
    if (Math.abs(o) > 1) {
      return {
        opacity: 0,
        pointerEvents: "none",
        transform: `translateX(${o * 180}px) scale(0.75)`,
        zIndex: 0,
      };
    }
    const tx = o * 90;
    const ty = Math.abs(o) * 16 - (isAct ? 16 : 0);
    const rz = o * 7;
    return {
      opacity: isAct ? 1 : 0.85,
      zIndex: isAct ? 30 : 20,
      transform: `translateX(${tx}px) translateY(${ty}px) rotateZ(${rz}deg) scale(${isAct ? 1 : 0.92})`,
    };
  }

  // Desktop arc / fan layout matching the screenshot
  if (Math.abs(o) > 2 && o !== 3 && o !== -3) {
    return {
      opacity: 0,
      pointerEvents: "none",
      transform: `translateX(${o * 240}px) scale(0.75)`,
      zIndex: 0,
    };
  }

  let tx = 0;
  let ty = 0;
  let tz = 0;
  let rz = 0;
  let rx = 0;
  let sc = 1;
  let zIndex = 10;
  let opacity = 0.9;

  if (o === 0) {
    // Active center card
    tx = 0;
    ty = -32;
    tz = 60;
    rz = 0;
    rx = 0;
    sc = 1.05;
    zIndex = 35;
    opacity = 1;
  } else if (o === -1) {
    // First card to the left
    tx = -140;
    ty = 4;
    tz = -40;
    rz = -9;
    rx = 4;
    sc = 0.94;
    zIndex = 25;
    opacity = 0.92;
  } else if (o === -2) {
    // Second card to the left
    tx = -270;
    ty = 36;
    tz = -120;
    rz = -18;
    rx = 8;
    sc = 0.87;
    zIndex = 15;
    opacity = 0.86;
  } else if (o === 1) {
    // First card to the right
    tx = 140;
    ty = 4;
    tz = -40;
    rz = 9;
    rx = 4;
    sc = 0.94;
    zIndex = 25;
    opacity = 0.92;
  } else if (o === 2) {
    // Second card to the right
    tx = 270;
    ty = 36;
    tz = -120;
    rz = 18;
    rx = 8;
    sc = 0.87;
    zIndex = 15;
    opacity = 0.86;
  } else {
    // 3rd / opposite card
    const sign = o > 0 ? 1 : -1;
    tx = sign * 380;
    ty = 60;
    tz = -200;
    rz = sign * 26;
    rx = 12;
    sc = 0.8;
    zIndex = 8;
    opacity = 0.72;
  }

  return {
    opacity,
    pointerEvents: "auto",
    zIndex,
    transform: `translateX(${tx}px) translateY(${ty}px) translateZ(${tz}px) rotateZ(${rz}deg) rotateX(${rx}deg) scale(${sc})`,
  };
}

export function ServicesStack() {
  // Start on 05 WEBSITE (index 4) matching the screenshot!
  const [activeIndex, setActiveIndex] = useState(4);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const deckRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    startX: number;
    activeIdx: number;
    isDragging: boolean;
  } | null>(null);

  const n = servicesData.length;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const goTo = useCallback(
    (idx: number) => {
      setActiveIndex(((idx % n) + n) % n);
    },
    [n]
  );

  // Auto-advance
  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion || isHovered || isFocused) return;

    const timer = setInterval(() => {
      if (!dragRef.current) {
        goTo(activeIndex + 1);
      }
    }, 4000);

    return () => clearInterval(timer);
  }, [activeIndex, goTo, isHovered, isFocused]);

  // Keyboard
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(activeIndex - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(activeIndex + 1);
    }
  };

  // Pointer drag gestures
  const handlePointerDown = (e: React.PointerEvent, idx: number) => {
    dragRef.current = {
      startX: e.clientX,
      activeIdx: idx,
      isDragging: false,
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current || dragRef.current.activeIdx !== activeIndex) return;
    const dx = e.clientX - dragRef.current.startX;
    if (Math.abs(dx) > 6) {
      dragRef.current.isDragging = true;
      const cardEl = e.currentTarget as HTMLElement;
      cardEl.style.transition = "none";
      const baseStyle = calculateCardStyle(activeIndex, activeIndex, n, isMobile);
      cardEl.style.transform = `${baseStyle.transform} translateX(${dx * 0.55}px)`;
    }
  };

  const handlePointerUp = (e: React.PointerEvent, idx: number) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const wasDragging = dragRef.current.isDragging;
    dragRef.current = null;

    const cardEl = e.currentTarget as HTMLElement;
    cardEl.style.transition = "";

    if (idx === activeIndex && Math.abs(dx) > 40) {
      goTo(activeIndex + (dx < 0 ? 1 : -1));
    } else if (idx !== activeIndex && !wasDragging) {
      goTo(idx);
    }
  };

  const handlePointerCancel = () => {
    dragRef.current = null;
    if (deckRef.current) {
      const cards = deckRef.current.querySelectorAll(".stack-fan-card");
      cards.forEach((el) => ((el as HTMLElement).style.transition = ""));
    }
  };

  return (
    <section className="services-fan-section" id="services">
      <div className="services-fan-wrap">
        {/* ── Section Header matching screenshot ── */}
        <div className="services-fan-header">
          <div className="services-fan-lbl">
            <span className="services-fan-dot">●</span> WHAT WE DO
          </div>
          <h2 className="services-fan-title">
            THE IDEA IS
            <br />
            JUST THE START<span className="services-fan-red-dot">.</span>
          </h2>
          <p className="services-fan-desc">
            Six connected disciplines. One clear direction for your
            <br />
            brand. Choose where you need us, and we&apos;ll shape the work
            <br />
            around you.
          </p>
        </div>

        {/* ── 3D Arc Deck ── */}
        <div
          ref={deckRef}
          className="services-fan-stage"
          tabIndex={0}
          role="region"
          aria-label="RAYZE Services Deck"
          onKeyDown={handleKeyDown}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        >
          {/* Ambient red diffusion glow under active card */}
          <div className="services-fan-glow" aria-hidden="true" />

          {servicesData.map((s, i) => {
            const isAct = i === activeIndex;
            const style = calculateCardStyle(i, activeIndex, n, isMobile);

            return (
              <div
                key={s.num}
                className={`stack-fan-card ${isAct ? "is-active" : ""}`}
                style={{
                  background: s.gradient,
                  ...style,
                }}
                onClick={() => {
                  if (!isAct) goTo(i);
                }}
                onPointerDown={(e) => handlePointerDown(e, i)}
                onPointerMove={handlePointerMove}
                onPointerUp={(e) => handlePointerUp(e, i)}
                onPointerCancel={handlePointerCancel}
              >
                {/* 3 interlocking thin white ovals watermark */}
                <svg
                  viewBox="0 0 600 300"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2.5"
                  className="stack-fan-ovals"
                  aria-hidden="true"
                >
                  <ellipse cx="170" cy="150" rx="110" ry="140" />
                  <ellipse cx="300" cy="150" rx="110" ry="140" />
                  <ellipse cx="430" cy="150" rx="110" ry="140" />
                </svg>

                {/* Subtle glass reflection sheen */}
                <div className="stack-fan-sheen" aria-hidden="true" />

                {/* Top row: Number and Arrow button */}
                <div className="stack-fan-top">
                  <span className="stack-fan-num">{s.num}</span>
                  <Link
                    href={`/contact?service=${encodeURIComponent(s.title)}`}
                    className={`stack-fan-arrow-btn ${isAct ? "is-act-arrow" : ""}`}
                    aria-label={`Enquire about ${s.title}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    ↗
                  </Link>
                </div>

                {/* Bottom content: Main Title (always) + expanded details (active only) */}
                <div className="stack-fan-bottom">
                  <h3 className="stack-fan-title">{s.title}</h3>

                  {isAct && (
                    <div className="stack-fan-details">
                      <b className="stack-fan-tagline">{s.tagline}</b>
                      <p className="stack-fan-p">{s.description}</p>
                      <div className="stack-fan-checklist">
                        <div className="stack-fan-col">
                          {s.delivCol1.map((item) => (
                            <span key={item}>— {item}</span>
                          ))}
                        </div>
                        <div className="stack-fan-col">
                          {s.delivCol2.map((item) => (
                            <span key={item}>— {item}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Navigation controls: prev, pill dots, next ── */}
        <div className="services-fan-controls">
          <button
            type="button"
            className="services-fan-btn prev"
            aria-label="Previous service"
            onClick={() => goTo(activeIndex - 1)}
          >
            ←
          </button>
          <div className="services-fan-dots" role="tablist">
            {servicesData.map((s, i) => (
              <button
                key={s.num}
                type="button"
                className={`services-fan-dot ${i === activeIndex ? "active" : ""}`}
                aria-label={`Select ${s.title}`}
                aria-selected={i === activeIndex}
                role="tab"
                onClick={() => goTo(i)}
              />
            ))}
          </div>
          <button
            type="button"
            className="services-fan-btn next"
            aria-label="Next service"
            onClick={() => goTo(activeIndex + 1)}
          >
            →
          </button>
        </div>

        {/* ── Counter: 05 / 06 — WEBSITE ── */}
        <div className="services-fan-counter" aria-live="polite">
          <span className="services-fan-counter-num">
            {servicesData[activeIndex].num} / 06
          </span>
          <span className="services-fan-counter-sep"> — </span>
          <span className="services-fan-counter-title">
            {servicesData[activeIndex].title}
          </span>
        </div>
      </div>
    </section>
  );
}

export default ServicesStack;
