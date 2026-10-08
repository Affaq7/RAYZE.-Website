"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, Star, Quote } from "lucide-react";

export interface TestimonialItem {
  /** Unique identifier for the card */
  id: string | number;
  /** Title / Client name displayed for the card */
  title: string;
  /** Description text for the card */
  description: string;
  /** Image URL/path for the card */
  image: string;
  /** Role / Company title */
  role?: string;
  /** Rating score out of 5 (default: 5) */
  rating?: number;
}

export interface TestimonialsCardProps {
  /** Array of testimonial items to display */
  items: TestimonialItem[];
  /** Additional CSS classes for the container */
  className?: string;
  /** Width of the card stack (default: 780) */
  width?: number;
  /** Whether to show navigation arrows (default: true) */
  showNavigation?: boolean;
  /** Whether to show the counter (default: true) */
  showCounter?: boolean;
  /** Whether to enable auto-play (default: false) */
  autoPlay?: boolean;
  /** Auto-play interval in ms (default: 4000) */
  autoPlayInterval?: number;
}

export function TestimonialsCard({
  items,
  className,
  width = 780,
  showNavigation = true,
  showCounter = true,
  autoPlay = false,
  autoPlayInterval = 4000,
}: TestimonialsCardProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const activeItem = items[activeIndex];

  // Auto-play effect
  useEffect(() => {
    if (!autoPlay || items.length <= 1) return;

    const interval = setInterval(() => {
      setDirection(1);
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, items.length]);

  const handleNext = () => {
    if (activeIndex < items.length - 1) {
      setDirection(1);
      setActiveIndex(activeIndex + 1);
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      setDirection(-1);
      setActiveIndex(activeIndex - 1);
    }
  };

  // Pre-calculate rotations for visual variety matching the user spec
  const rotations = useMemo(() => [4, -2, -9, 7], []);

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex items-center justify-center p-4 sm:p-8", className)}>
      <div
        className="relative grid grid-cols-1 md:grid-cols-[1fr_1.1fr] md:grid-rows-[auto_auto_auto] gap-x-10 gap-y-4 w-full items-center"
        style={{ perspective: "1400px", maxWidth: `${width}px` }}
      >
        {/* Counter and Star Rating Top Bar */}
        <div className="row-start-1 col-start-1 md:col-start-2 md:row-start-1 flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-1.5" aria-label="5 star rating">
            {[...Array(activeItem.rating || 5)].map((_, i) => (
              <Star
                key={i}
                className="w-4 h-4 fill-[#e8241a] text-[#e8241a] drop-shadow-[0_0_8px_rgba(232,36,26,0.6)]"
              />
            ))}
            <span className="text-xs font-mono font-bold tracking-wider text-[#e8241a] ml-1.5">
              5.0 VERIFIED
            </span>
          </div>

          {showCounter && (
            <div className="font-mono text-xs tracking-wider text-neutral-400">
              0{activeIndex + 1} / 0{items.length}
            </div>
          )}
        </div>

        {/* Image Card Stack */}
        <div className="row-start-2 col-start-1 md:row-start-1 md:row-span-3 relative w-full aspect-square max-w-[340px] sm:max-w-[380px] mx-auto my-2 md:my-0">
          <AnimatePresence custom={direction}>
            {items.map((item, index) => {
              const isActive = index === activeIndex;
              const offset = index - activeIndex;

              return (
                <motion.div
                  key={item.id}
                  className="absolute inset-0 w-full h-full overflow-hidden border-[3px] bg-[#141414] border-white/20 shadow-2xl rounded-xl cursor-pointer"
                  onClick={() => {
                    if (!isActive) {
                      setDirection(index > activeIndex ? 1 : -1);
                      setActiveIndex(index);
                    }
                  }}
                  initial={{
                    x: offset * 15,
                    y: Math.abs(offset) * 6,
                    z: -150 * Math.abs(offset),
                    scale: 0.85 - Math.abs(offset) * 0.04,
                    rotateZ: rotations[index % 4],
                    opacity: isActive ? 1 : 0.5,
                    zIndex: 10 - Math.abs(offset),
                  }}
                  animate={
                    isActive
                      ? {
                          x: [offset * 15, direction === 1 ? -200 : 200, 0],
                          y: [Math.abs(offset) * 6, 0, 0],
                          z: [-200, 150, 250],
                          scale: [0.85, 1.05, 1],
                          rotateZ: [rotations[index % 4], -5, 0],
                          opacity: 1,
                          zIndex: 100,
                        }
                      : {
                          x: offset * 15,
                          y: Math.abs(offset) * 6,
                          z: -150 * Math.abs(offset),
                          rotateZ: rotations[index % 4],
                          scale: 0.85 - Math.abs(offset) * 0.04,
                          opacity: 0.55,
                          zIndex: 10 - Math.abs(offset),
                        }
                  }
                  exit={{
                    x: direction === 1 ? -250 : 250,
                    z: -260,
                    scale: 0.75,
                    rotateZ: direction === 1 ? -10 : 10,
                    opacity: 0,
                  }}
                  transition={{
                    duration: 0.75,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover select-none pointer-events-none"
                    draggable={false}
                  />

                  {/* Gradient shadow for text legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                  {/* Client title pill on card */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white pointer-events-none">
                    <span className="text-xs font-mono tracking-wider uppercase text-[#e8241a] font-black">
                      {item.title}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-white/70 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded border border-white/10">
                      CLIENT
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Text Area */}
        <div className="col-start-1 md:col-start-2 md:row-start-2 flex flex-col justify-center min-h-[140px] pt-2 md:pt-0">
          <Quote className="w-8 h-8 text-[#e8241a]/40 mb-2 -ml-1 select-none" />
          <AnimatePresence mode="wait">
            <motion.div
              key={activeItem.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
            >
              <p className="text-base sm:text-lg font-medium text-white/95 leading-relaxed tracking-tight">
                &ldquo;{activeItem.description}&rdquo;
              </p>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black uppercase text-white tracking-tight">
                    {activeItem.title}
                  </h3>
                  {activeItem.role && (
                    <p className="text-xs text-[#9a9a9a] uppercase tracking-wider mt-0.5 font-medium">
                      {activeItem.role}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  {[...Array(activeItem.rating || 5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3.5 h-3.5 fill-[#e8241a] text-[#e8241a]"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Controls */}
        {showNavigation && items.length > 1 && (
          <div className="col-start-1 md:col-start-2 md:row-start-3 flex items-center justify-between mt-3 md:mt-4">
            <div className="flex gap-2.5">
              <button
                type="button"
                disabled={activeIndex === 0}
                onClick={handlePrev}
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border border-white/15 bg-white/5 text-white transition-all duration-300",
                  activeIndex === 0
                    ? "opacity-30 cursor-not-allowed border-white/5"
                    : "hover:bg-[#e8241a] hover:border-[#e8241a] hover:scale-105 active:scale-95 hover:shadow-[0_0_15px_rgba(232,36,26,0.5)]"
                )}
                aria-label="Previous review"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={activeIndex === items.length - 1}
                onClick={handleNext}
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border border-white/15 bg-white/5 text-white transition-all duration-300",
                  activeIndex === items.length - 1
                    ? "opacity-30 cursor-not-allowed border-white/5"
                    : "hover:bg-[#e8241a] hover:border-[#e8241a] hover:scale-105 active:scale-95 hover:shadow-[0_0_15px_rgba(232,36,26,0.5)]"
                )}
                aria-label="Next review"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Pagination dots */}
            <div className="flex gap-1.5 items-center">
              {items.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setDirection(i > activeIndex ? 1 : -1);
                    setActiveIndex(i);
                  }}
                  className={cn(
                    "h-1.5 transition-all duration-300 rounded-full",
                    i === activeIndex
                      ? "w-6 bg-[#e8241a] shadow-[0_0_8px_#e8241a]"
                      : "w-1.5 bg-white/20 hover:bg-white/50"
                  )}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TestimonialsCard;
