"use client";

import React from "react";
import Link from "next/link";
import { Arrow } from "@/components/ui/arrow";
import { Marquee } from "@/components/motion/motion";
import { cn } from "@/lib/utils";

export interface HeroProps extends React.HTMLAttributes<HTMLElement> {
  titleTop?: string;
  titleHighlight?: string;
  ctaText?: string;
  ctaHref?: string;
}

export function Hero({
  titleTop = "RISE WITH",
  titleHighlight = "RAYZE.",
  ctaText = "Start a project",
  ctaHref = "/contact",
  className,
  ...props
}: HeroProps) {
  return (
    <section
      className={cn("hero-section bg-black", className)}
      style={{ background: "#0a0a0a" }}
      {...props}
    >
      <div className="hero wrap relative z-10 hero-centered-layout">
        {/* Centered 2-Line Headline */}
        <div className="hero-center-headline">
          <h1>
            {titleTop}
            <br />
            <span>{titleHighlight}</span>
          </h1>
        </div>

        {/* Center Bottom: Oval Red Glass CTA Button */}
        <div className="hero-center-cta">
          <Link className="button-glass-red-oval" href={ctaHref}>
            <span>{ctaText}</span>
            <Arrow diagonal />
          </Link>
        </div>

        {/* Bottom Right: Explore RAYZE where it is */}
        <div className="hero-scroll-corner">
          <a href="#intro">Explore RAYZE ↓</a>
        </div>
      </div>

      {/* Marquee within the hero section */}
      <div className="relative z-10 w-full">
        <Marquee />
      </div>
    </section>
  );
}

export default Hero;
