"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { services } from "@/lib/validation";

/** 45 vertical band heights forming the center-peaked funnel */
const BAND_HEIGHTS = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 8, 15, 22, 30, 38, 47, 58, 70, 88,
  88, 88, 70, 58, 47, 38, 30, 22, 15, 8, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0,
];

export function ContactSection({ defaultService }: { defaultService?: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const idempotencyKeyRef = useRef<string>("");
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "pending") return;

    const form = e.currentTarget;
    const formData = new FormData(form);

    // If honeypot is filled, simulate success silently
    if (formData.get("website")) {
      setStatus("success");
      form.reset();
      return;
    }

    idempotencyKeyRef.current ||= crypto.randomUUID();

    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      company: formData.get("company") || "",
      service: formData.get("service"),
      message: formData.get("message"),
      website: formData.get("website") || "",
      idempotency_key: idempotencyKeyRef.current,
    };

    setStatus("pending");
    setErrorMessage("");

    try {
      // Send message to Formspree endpoint requested by user
      const res = await fetch("https://formspree.io/f/xnpjpvbb", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      // Also log locally to internal API in the background if available
      fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(() => {});

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.errors?.[0]?.message ||
            errorData.error ||
            "Unable to send your enquiry. Please try again."
        );
      }

      setStatus("success");
      form.reset();
      idempotencyKeyRef.current = "";
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Unable to send. Please try again."
      );
    }
  };

  return (
    <section className="contact" id="contact">
      {/* Funnel of navy columns: tallest in the centre */}
      <div className="bands" aria-hidden="true">
        {BAND_HEIGHTS.map((height, idx) => (
          <i key={idx}>
            <b style={{ height: `${height}%` }} />
          </i>
        ))}
      </div>

      <div className="contact-wrap">
        <div>
          <h2>
            <span className="ln">
              <span>It starts</span>
            </span>
            <span className="ln">
              <span>with a</span>
            </span>
            <span className="ln">
              <span>conversation.</span>
            </span>
          </h2>
          <p className="lede">
            Share a little about your business and what you have in mind. We&rsquo;ll
            use your details to get back to you about the next step.
          </p>
          <svg
            className="arrow"
            viewBox="0 0 56 56"
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            aria-hidden="true"
          >
            <path d="M6 50L48 8" />
            <path d="M16 6h34v34" />
          </svg>
        </div>

        <form
          id="f"
          ref={formRef}
          action="https://formspree.io/f/xnpjpvbb"
          method="POST"
          onSubmit={handleSubmit}
        >
          <div className="row">
            <div>
              <label htmlFor="n">Your name</label>
              <input
                id="n"
                name="name"
                required
                autoComplete="name"
                maxLength={100}
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label htmlFor="e">Email address</label>
              <input
                id="e"
                name="email"
                type="email"
                required
                autoComplete="email"
                maxLength={254}
                placeholder="jane@example.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="c">
              Company<small>(optional)</small>
            </label>
            <input
              id="c"
              name="company"
              autoComplete="organization"
              maxLength={150}
              placeholder="Acme Studio"
            />
          </div>

          <div>
            <label htmlFor="s">What can we help with?</label>
            <select
              id="s"
              name="service"
              required
              defaultValue={
                services.includes(defaultService as (typeof services)[number])
                  ? defaultService
                  : ""
              }
            >
              <option value="" disabled>
                Select a service
              </option>
              {services.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="p">Tell us about your project</label>
            <textarea
              id="p"
              name="message"
              required
              maxLength={5000}
              placeholder="The idea, the challenge, or what you'd like to change."
            />
          </div>

          {/* Honeypot field for spam prevention */}
          <div className="contact-honeypot" aria-hidden="true">
            <label htmlFor="contact-website-input">Leave this blank</label>
            <input
              id="contact-website-input"
              name="website"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div>
            <p className="legal">
              By submitting, you agree that we may use these details to respond to
              your enquiry. Read our <Link href="/privacy">privacy notice</Link>.
            </p>
            <button type="submit" disabled={status === "pending"} style={{ marginTop: "20px" }}>
              {status === "pending" ? "Sending…" : "Send enquiry"}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                aria-hidden="true"
              >
                <path d="M4 20L20 4M8 4h12v12" />
              </svg>
            </button>
            <p
              id="ok"
              role="status"
              className={status === "success" ? "show" : ""}
            >
              Thanks. We&rsquo;ll be in touch soon.
            </p>
            {status === "error" && (
              <p className="form-error" role="alert">
                {errorMessage}
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
