"use client";

import React from "react";
import { Star } from "lucide-react";
import { TestimonialsCard, TestimonialItem } from "@/components/ui/testimonials-card";

export const REVIEWS_DATA: TestimonialItem[] = [
  {
    id: 1,
    title: "Glow Studio",
    role: "Elena Vance — Founder & Creative Director",
    description:
      "RAYZE completely transformed our digital presence. Within 90 days of launching our campaign, our direct customer engagement jumped 320% and retail inquiries doubled. Unrivaled taste level.",
    image: "/images/reviews/glow-studio.jpg",
    rating: 5,
  },
  {
    id: 2,
    title: "Ember Kitchen",
    role: "Marcus Sterling — Executive Chef & Co-Owner",
    description:
      "Working with RAYZE was the sharpest decision we made this year. They captured the raw fire and sophistication of our culinary space in video and brand identity. Fully booked 6 weeks out.",
    image: "/images/reviews/ember-kitchen.jpg",
    rating: 5,
  },
  {
    id: 3,
    title: "Peak Gym",
    role: "Damon Ross — Head of Performance",
    description:
      "Brutal, clean, and aggressively effective. RAYZE took our community engagement from flatlined to an obsessed cult following. Their content and visual production is tier-one.",
    image: "/images/reviews/peak-gym.jpg",
    rating: 5,
  },
  {
    id: 4,
    title: "Haven Homes",
    role: "Sophia Lin — Principal Architect",
    description:
      "The cinematic architectural showcases RAYZE produced transformed how high-net-worth buyers interact with our developments. True artistic vision backed by real conversions.",
    image: "/images/reviews/haven-homes.svg",
    rating: 5,
  },
  {
    id: 5,
    title: "Nova Store",
    role: "Julian Cole — Head of Growth",
    description:
      "From zero-friction brand identity to automated customer journeys, RAYZE delivered pure impact. Our average order value increased 42% on the new release.",
    image: "/images/reviews/nova-store.svg",
    rating: 5,
  },
];

export function ReviewsSection() {
  return (
    <section id="reviews" className="work-reviews-sec" aria-label="Client Reviews">
      <div className="work-reviews-inner">
        {/* Header with Star Rating */}
        <div className="work-reviews-header">
          <div className="work-reviews-top-row">
            <span className="work-tag">— CLIENT REVIEWS</span>
            <div className="work-reviews-rating-pill">
              <div className="flex items-center gap-1 text-[#e8241a]" aria-hidden="true">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-[#e8241a] text-[#e8241a] drop-shadow-[0_0_8px_rgba(232,36,26,0.6)]"
                  />
                ))}
              </div>
              <span className="font-mono text-xs font-bold tracking-wider text-white">
                5.0 RATED
              </span>
            </div>
          </div>

          <div className="work-reviews-title-block">
            <h2 className="work-reviews-heading">
              <span>CLIENT</span>{" "}
              <span className="work-title-red">REVIEWS.</span>{" "}
              <span className="work-heading-stars" aria-label="Five stars">
                ★★★★★
              </span>
            </h2>
            <p className="work-reviews-sub">
              Real partnerships. Real measurable growth. Hear from the founders who chose to rise with RAYZE.
            </p>
          </div>
        </div>

        {/* 3D Testimonials Card Stack */}
        <div className="work-reviews-card-wrap">
          <TestimonialsCard
            items={REVIEWS_DATA}
            width={860}
            autoPlay
            autoPlayInterval={5000}
          />
        </div>
      </div>
    </section>
  );
}

export default ReviewsSection;
