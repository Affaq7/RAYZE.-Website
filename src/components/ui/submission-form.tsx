"use client";
import { useRef, useState } from "react";
import { services } from "@/lib/validation";
import { Arrow } from "./arrow";
export function SubmissionForm({
  jobId,
  service,
}: {
  jobId?: string;
  service?: string;
}) {
  const key = useRef<string>("");
  const [state, setState] = useState<"idle" | "pending" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");
  return (
    <form
      className="submission-form"
      action={jobId ? undefined : "https://formspree.io/f/xnpjpvbb"}
      method="POST"
      onSubmit={async (e) => {
        e.preventDefault();
        if (state === "pending") return;
        const form = e.currentTarget;
        const data = new FormData(form);

        if (!jobId && data.get("website")) {
          setState("success");
          setMessage("Your enquiry has been received. We’ll be in touch using the email you provided.");
          form.reset();
          return;
        }

        key.current ||= crypto.randomUUID();
        data.set("idempotency_key", key.current);
        setState("pending");
        setMessage("");
        try {
          const endpoint = jobId
            ? `/api/careers/${jobId}/apply`
            : "https://formspree.io/f/xnpjpvbb";

          const response = await fetch(endpoint, {
            method: "POST",
            headers: { Accept: "application/json" },
            body: data,
          });

          if (!jobId) {
            fetch("/api/contact", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(Object.fromEntries(data)),
            }).catch(() => {});
          }

          const result = await response.json().catch(() => ({}));
          if (!response.ok)
            throw new Error(
              result.errors?.[0]?.message ||
                result.error ||
                "Please try again later."
            );
          setState("success");
          setMessage(
            jobId
              ? "Your application has been received. Thank you for your interest in RAYZE."
              : "Your enquiry has been received. We’ll be in touch using the email you provided."
          );
          form.reset();
          key.current = "";
        } catch (error) {
          setState("error");
          setMessage(
            error instanceof Error
              ? error.message
              : "Unable to send. Please try again."
          );
        }
      }}
    >
      <div className="form-pair">
        <label>
          Your name
          <input name="name" autoComplete="name" required maxLength={100} />
        </label>
        <label>
          Email address
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
          />
        </label>
      </div>
      {!jobId && (
        <>
          <label>
            Company <span>(optional)</span>
            <input name="company" autoComplete="organization" maxLength={150} />
          </label>
          <label>
            What can we help with?
            <select
              name="service"
              defaultValue={
                services.includes(service as (typeof services)[number])
                  ? service
                  : ""
              }
              required
            >
              <option value="" disabled>
                Select a service
              </option>
              {services.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
        </>
      )}
      <label>
        {jobId
          ? "Tell us about yourself (optional)"
          : "Tell us about your project"}
        <textarea
          name={jobId ? "cover_letter" : "message"}
          rows={5}
          required={!jobId}
          maxLength={5000}
          placeholder={
            jobId
              ? "Your experience, interests and why this role."
              : "The idea, the challenge, or what you’d like to change."
          }
        />
      </label>
      {jobId && (
        <label>
          Resume <span>PDF only · up to 3 MB · private</span>
          <input
            name="resume"
            type="file"
            accept="application/pdf,.pdf"
            required
          />
          <small>
            Only authorized RAYZE administrators can access your resume.
          </small>
        </label>
      )}
      <div className="honeypot" aria-hidden="true">
        <label>
          Leave this field empty
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <p className="form-note">
        By submitting, you agree that RAYZE may use these details to respond to
        your {jobId ? "application" : "enquiry"}. Read our{" "}
        <a href="/privacy">privacy notice</a>.
      </p>
      <button className="button" disabled={state === "pending"}>
        {state === "pending"
          ? "Sending…"
          : jobId
            ? "Send application"
            : "Send enquiry"}
        <Arrow diagonal />
      </button>
      <p
        role={state === "error" ? "alert" : "status"}
        aria-live="polite"
        className="form-message"
      >
        {message}
      </p>
    </form>
  );
}
