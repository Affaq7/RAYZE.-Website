"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

const CARDS = [
  { num: "01", title: "STRATEGY", desc: "Direction behind every move." },
  { num: "02", title: "CREATIVITY", desc: "Ideas that stop the scroll." },
  { num: "03", title: "CONTENT", desc: "Posts, reels and edits that perform." },
];

export function AboutFeature() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const tiltX = (y - 0.5) * -12;
    const tiltY = (x - 0.5) * 12;
    card.style.transform = `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-6px)`;
    card.style.setProperty("--spot-x", `${x * 100}%`);
    card.style.setProperty("--spot-y", `${y * 100}%`);
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.transform = `perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
    card.style.setProperty("--spot-x", "50%");
    card.style.setProperty("--spot-y", "50%");
  };

  const handleBadgeMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const badge = e.currentTarget;
    const rect = badge.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) * 0.28;
    const y = (e.clientY - (rect.top + rect.height / 2)) * 0.28;
    badge.style.transform = `translate(${x}px, ${y}px) scale(1.08)`;
  };

  const handleBadgeMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const badge = e.currentTarget;
    badge.style.transform = `translate(0px, 0px) scale(1)`;
  };

  return (
    <section
      ref={sectionRef}
      id="about-feature"
      className={`about-feature-section ${isInView ? "is-visible" : ""}`}
      aria-label="About RAYZE"
    >
      {/* Subtle deep ambient glow behind typography */}
      <div className="about-feature-ambient" aria-hidden="true" />

      {/* Architectural vertical accent bar on left */}
      <div className="about-feature-accent-line" aria-hidden="true">
        <span className="accent-line-glow" />
      </div>

      <div className="about-feature-container">
        {/* Top Tag */}
        <div className="about-feature-tag-wrapper">
          <span className="about-feature-tag">ABOUT US</span>
        </div>

        {/* Massive Headline with mask clip entrance */}
        <div className="about-feature-headline">
          <div className="headline-line-mask">
            <h2 className="headline-line line-white">
              CONTENT THAT CUTS.
            </h2>
          </div>
          <div className="headline-line-mask">
            <h2 className="headline-line line-red">
              STRATEGY THAT
            </h2>
          </div>
          <div className="headline-line-mask">
            <h2 className="headline-line line-red">
              STICKS.
            </h2>
          </div>
        </div>

        {/* Center Editorial Copy */}
        <div className="about-feature-body">
          <p className="about-feature-desc">
            RAYZE. is a modern marketing agency for brands that refuse to blend
            in. Every post, every edit, every campaign is built with intention.
            Nothing filler, nothing generic.
          </p>
          <div className="about-feature-link-wrap">
            <Link href="/about" className="about-feature-more-link">
              <span>See more</span>
              <svg
                className="link-arrow"
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M4 12L12 4M12 4H5M12 4V11"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="square"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* Bottom 3 Strategic Cards with 3D Tilt */}
        <div className="about-feature-grid">
          {CARDS.map((card, idx) => (
            <div
              key={card.num}
              className="about-feature-card"
              style={{ "--card-index": idx } as React.CSSProperties}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
            >
              <div className="card-top-indicator" aria-hidden="true" />
              <div className="card-glare" aria-hidden="true" />
              <div className="card-num">{card.num}</div>
              <h3 className="card-title">{card.title}</h3>
              <p className="card-desc">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Rotating Circular Brand Badge with magnetic cursor hover */}
      <div className="about-feature-badge-anchor" aria-hidden="true">
        <div
          className="about-feature-badge"
          onMouseMove={handleBadgeMouseMove}
          onMouseLeave={handleBadgeMouseLeave}
        >
          <svg
            className="badge-ring-svg"
            viewBox="0 0 120 120"
            width="120"
            height="120"
          >
            <path
              id="featureBadgeCircle"
              d="M 60, 60 m -44, 0 a 44,44 0 1,1 88,0 a 44,44 0 1,1 -88,0"
              fill="none"
            />
            <text className="badge-ring-text">
              <textPath
                href="#featureBadgeCircle"
                startOffset="0%"
                spacing="auto"
              >
                RISE WITH RAYZE • RISE WITH RAYZE •
              </textPath>
            </text>
          </svg>
          <div className="badge-static-arrow">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#e8241a"
              strokeWidth="2.5"
              strokeLinecap="square"
            >
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutFeature;
