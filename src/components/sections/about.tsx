"use client";

import Link from "next/link";
import Image from "next/image";
import { HoverPreview } from "@/components/ui/hover-preview";
import { useEffect, useRef } from "react";

/* ─── Static configuration ──────────────────────────────────────── */
const pills = ["EST. 2026", "REMOTE-FIRST", "WORLDWIDE CLIENTS"];

const previewData = {
  identity: {
    title: "Identity",
    subtitle: "Marks, type & visual worlds",
    gradient: "linear-gradient(145deg,#e4202c,#5a0a10)",
    symbol: "Aa",
  },
  content: {
    title: "Content",
    subtitle: "Reels & shoots that stop the scroll",
    gradient: "linear-gradient(145deg,#111,#c41a24)",
    symbol: "▶",
  },
  digital: {
    title: "Digital",
    subtitle: "Sites & campaigns that convert",
    gradient: "linear-gradient(145deg,#7a0f16,#0c0c0c)",
    symbol: "↗",
  },
  strategy: {
    title: "Strategy",
    subtitle: "A plan with a point of view",
    gradient: "linear-gradient(145deg,#f0373f,#2a0508)",
    symbol: "01",
  },
  direction: {
    title: "Creative Direction",
    subtitle: "One vision, every touchpoint",
    gradient: "linear-gradient(145deg,#b3151f,#160305)",
    symbol: "✦",
  },
};

const serviceChips = [
  "Brand Identity",
  "Visual Storytelling",
  "Website Design",
  "Content Creation",
  "Digital Strategy",
];

const industries = [
  "Fashion & Beauty",
  "Restaurants / Cafes",
  "Healthcare",
  "Travel & Hospitality",
  "Health & Fitness",
  "Education & E-Learning",
  "Real Estate",
  "Professional Services",
  "Events & Weddings",
  "E-commerce & Retail",
  "Automotive",
  "Personal Brands",
  "Technology & Startups",
];

export function AboutSection({
  showBottomCta = true,
}: {
  showBottomCta?: boolean;
}) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      root.querySelectorAll(".rv").forEach((el) => el.classList.add("on"));
      return;
    }

    if (!("IntersectionObserver" in window)) {
      root.querySelectorAll(".rv").forEach((el) => el.classList.add("on"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("on");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    const elements = root.querySelectorAll(".rv");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="about-section">
      <div className="about-w">
        {/* ── 1. Label ── */}
        <div className="about-lbl rv">ABOUT US — THE STUDIO</div>

        {/* ── 2. Headline & Pills ── */}
        <header className="about-hero">
          <h1 className="about-h1 rv">
            A creative studio
            <br />
            <span className="serif red">built for impact.</span>
          </h1>

          <div className="about-hero-b rv">
            <div className="about-pills">
              {pills.map((pill) => (
                <span key={pill}>{pill}</span>
              ))}
            </div>
          </div>
        </header>

        <div className="about-line-divider" />

        {/* ── 3. Story ── */}
        <div className="about-two-col rv">
          <div className="about-two-col-left">
            <div className="about-logo-frame">
              <div className="about-logo-inner">
                <Image
                  src="/images/rayze-fluted-logo.jpg"
                  alt="RAYZE Brand Emblem"
                  width={600}
                  height={600}
                  className="about-logo-img"
                  priority
                />
              </div>
              <div className="about-logo-corners" aria-hidden="true">
                <span className="corner top-left" />
                <span className="corner top-right" />
                <span className="corner bottom-left" />
                <span className="corner bottom-right" />
              </div>
            </div>
          </div>
          <div className="about-story-text">
            <p className="about-txt">
              RAYZE. is a studio for brands that refuse to blend in. We pair
              sharp strategy with bold creative, so every post, edit and
              campaign earns attention, builds identity and moves the numbers.
            </p>
            <p className="about-txt">
              Great marketing shouldn&apos;t feel like advertising. It should feel
              relevant, memorable and impossible to ignore. Nothing filler.
              Nothing generic.
            </p>
          </div>
        </div>

        <div className="about-line-divider" />

        {/* ── 4. Hover-preview statement (centrepiece) ── */}
        <div className="about-statement-container rv">
          <p className="about-hp">
            {"We build "}
            <HoverPreview preview={previewData.identity}>
              identities
            </HoverPreview>
            {" people recognise, shape "}
            <HoverPreview preview={previewData.content}>
              content
            </HoverPreview>
            {" that stops thumbs, and craft "}
            <HoverPreview preview={previewData.digital}>
              digital
            </HoverPreview>
            {" homes that convert — steered by "}
            <HoverPreview preview={previewData.strategy}>
              strategy
            </HoverPreview>
            {" and held together by one "}
            <HoverPreview preview={previewData.direction}>
              creative direction
            </HoverPreview>
            {"."}
          </p>
        </div>
      </div>

      {/* ── 5. Rounded gradient quote block ── */}
      <div className="about-w-quote rv">
        <section className="about-quote">
          {/* Three interlocking thin white ovals motif */}
          <svg
            viewBox="0 0 600 300"
            fill="none"
            stroke="#fff"
            strokeWidth="3"
            aria-hidden="true"
          >
            <ellipse cx="170" cy="150" rx="110" ry="140" />
            <ellipse cx="300" cy="150" rx="110" ry="140" />
            <ellipse cx="430" cy="150" rx="110" ry="140" />
          </svg>

          <div className="about-q">
            “Content
            <br />
            that cuts,
            <br />
            <span className="serif">strategy that sticks.”</span>
          </div>

          <p className="about-quote-sub">
            Your brand. Everywhere it needs to be — one creative direction across
            identity, content, social and digital.
          </p>

          <div className="about-chips">
            {serviceChips.map((chip) => (
              <span key={chip}>{chip}</span>
            ))}
          </div>
        </section>
      </div>

      <div className="about-w">
        <div className="about-line-divider" />

        {/* ── 6. Industries strip ── */}
        <section className="about-industries-sec rv">
          <div className="about-lbl">INDUSTRIES WE SERVE</div>
          <h2 className="about-h2">
            Every industry
            <br />
            has a story. <span className="serif red">We tell it.</span>
          </h2>

          <div className="about-ind">
            {industries.map((ind) => (
              <span key={ind}>{ind}</span>
            ))}
          </div>
        </section>

        {/* ── Subtle bottom conversion action ── */}
        {showBottomCta && (
          <div className="about-bottom-cta rv">
            <Link href="/contact" className="about-cta-btn">
              Start a project <b>↗</b>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export default AboutSection;
