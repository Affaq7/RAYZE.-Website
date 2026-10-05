"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface AuroraHeroProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** The main title text to display with the glass displacement effect. */
  title?: string;
  /** Whether to show the toggle switch for background modes. */
  showSwitch?: boolean;
}

export function AuroraHero({
  title = "An awesome title",
  className,
  ...props
}: AuroraHeroProps) {
  // Red / dark-red SVG used for the fluted glass displacement effect
  const filterImageHref =
    "data:image/svg+xml," +
    encodeURIComponent(`
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1 1"
        color-interpolation-filters="sRGB"
      >
        <g>
          <rect width="1" height="1" fill="black" />

          <rect
            width="1"
            height="1"
            fill="url(#red)"
            style="mix-blend-mode:screen"
          />

          <rect
            width="1"
            height="1"
            fill="url(#darkRed)"
            style="mix-blend-mode:screen"
          />

          <rect
            width="1"
            height="1"
            fill="url(#redGlow)"
            style="mix-blend-mode:screen"
          />
        </g>

        <defs>
          <radialGradient id="red" cx="0" cy="1" r="1">
            <stop stop-color="#FC1906" />
            <stop
              stop-color="#FC1906"
              offset="1"
              stop-opacity="0"
            />
          </radialGradient>

          <radialGradient id="darkRed" cx="1" cy="0" r="1">
            <stop stop-color="#DD0500" />
            <stop
              stop-color="#DD0500"
              offset="1"
              stop-opacity="0"
            />
          </radialGradient>

          <radialGradient id="redGlow" cx="0" cy="0" r="1">
            <stop stop-color="#FC1906" />
            <stop
              stop-color="#FC1906"
              offset="1"
              stop-opacity="0"
            />
          </radialGradient>
        </defs>
      </svg>
    `);

  return (
    <section
      className={cn(
        "aurora-hero-wrapper w-full min-h-[400px] h-[500px] sm:h-[600px] relative overflow-hidden",
        className
      )}
      {...props}
    >
      <style>{`
        .aurora-hero-wrapper {
          --stripe-color: #000000;
          --bg-filter: blur(10px) opacity(65%) saturate(170%);
          background: #000000;
          font-family: Inter, sans-serif;
        }

        @keyframes smoothBg {
          from {
            background-position: 50% 50%, 50% 50%;
          }

          to {
            background-position: 350% 50%, 350% 50%;
          }
        }

        .aurora-hero-bg {
          width: 100%;
          height: 100%;
          position: absolute;
          inset: 0;

          --stripes: repeating-linear-gradient(
            100deg,
            #000000 0%,
            #000000 7%,
            transparent 10%,
            transparent 12%,
            #000000 16%
          );

          --rayze-gradient: repeating-linear-gradient(
            100deg,
            #DD0500 5%,
            #FC1906 12%,
            #000000 20%,
            #DD0500 28%,
            #FC1906 36%,
            #000000 45%
          );

          background-image:
            var(--stripes),
            var(--rayze-gradient);

          background-size: 300%, 200%;
          background-position: 50% 50%, 50% 50%;

          filter: var(--bg-filter);

          mask-image: radial-gradient(
            ellipse at 100% 0%,
            black 40%,
            transparent 75%
          );

          -webkit-mask-image: radial-gradient(
            ellipse at 100% 0%,
            black 40%,
            transparent 75%
          );
        }

        .aurora-hero-bg::after {
          content: "";
          position: absolute;
          inset: 0;

          background-image:
            var(--stripes),
            var(--rayze-gradient);

          background-size: 200%, 100%;

          animation: smoothBg 45s linear infinite;

          background-attachment: fixed;

          mix-blend-mode: screen;
        }

        .aurora-content {
          position: absolute;
          inset: 0;

          width: 100%;
          height: 100%;

          display: flex;
          place-content: center;
          place-items: center;

          flex-flow: column;
          gap: 4.5%;

          text-align: center;

          backdrop-filter:
            contrast(0.9)
            blur(7px)
            url(#fluted);

          -webkit-backdrop-filter:
            contrast(0.9)
            blur(7px)
            url(#fluted);

          mix-blend-mode: normal;

          filter: none;
        }

        .h1-scalingSize {
          font-size: calc(1rem - -5vw);

          position: relative;
          isolation: isolate;

          font-weight: 700;

          color: #ffffff;

          letter-spacing: -0.03em;
        }

        .h1-scalingSize::first-letter {
          font-size: 300%;
        }

        .h1-scalingSize::before {
          content: attr(data-text);

          position: absolute;
          inset: 0;

          background: linear-gradient(
            135deg,
            #ffffff 0%,
            #ffffff 35%,
            #FC1906 75%,
            #DD0500 100%
          );

          background-clip: text;
          -webkit-background-clip: text;

          -webkit-text-fill-color: transparent;

          -webkit-mask: linear-gradient(#000 0 0) luminance;
          mask: linear-gradient(#000 0 0) luminance, alpha;

          backdrop-filter:
            blur(19px)
            brightness(3);

          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.8);

          display: flex;

          margin: auto;

          z-index: 1;

          pointer-events: none;
        }
      `}</style>

      <div className="aurora-hero-bg" />

      <div className="aurora-content">
        <h1 className="h1-scalingSize" data-text={title}>
          {title}
        </h1>
      </div>

      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        colorInterpolationFilters="sRGB"
        style={{
          position: "absolute",
          opacity: 0,
          height: 0,
          width: 0,
          pointerEvents: "none",
        }}
        aria-hidden="true"
        focusable="false"
      >
        <filter
          id="fluted"
          primitiveUnits="objectBoundingBox"
        >
          <feImage
            x="0"
            y="0"
            result="image_0"
            crossOrigin="anonymous"
            href={filterImageHref}
            preserveAspectRatio="none meet"
            width=".03"
            height="1"
          />

          <feTile
            in="image_0"
            result="tile_0"
          />

          <feGaussianBlur
            stdDeviation=".0001"
            edgeMode="none"
            in="tile_0"
            result="bar_smoothness"
            x="0"
            y="0"
          />

          <feDisplacementMap
            scale=".08"
            xChannelSelector="R"
            yChannelSelector="G"
            in="SourceGraphic"
            in2="bar_smoothness"
            result="displacement_0"
          />
        </filter>
      </svg>
    </section>
  );
}

export default AuroraHero;
