import { z } from "zod";
export const services = [
  "Social Media Management",
  "Logo Design",
  "Brand Design",
  "Video Editing & Animation",
  "Website",
  "Automations",
] as const;
export const safeUrl = z
  .string()
  .max(2000)
  .refine(
    (v) =>
      !v ||
      (() => {
        try {
          const u = new URL(v);
          return (
            ["https:", "http:"].includes(u.protocol) &&
            !u.username &&
            !u.password
          );
        } catch {
          return false;
        }
      })(),
    "Use an http or https URL.",
  );
export const id = z.uuid();
const text = (n: number) => z.string().trim().min(1).max(n);
export const contactSchema = z.object({
  name: text(100),
  email: z.email().max(254),
  company: z.string().trim().max(150).default(""),
  service: z.enum(services),
  message: text(5000),
  website: z.string().max(500).default(""),
  idempotency_key: id,
});
export const applicationSchema = z.object({
  name: text(100),
  email: z.email().max(254),
  cover_letter: z.string().trim().max(5000).default(""),
  website: z.string().max(500).default(""),
  idempotency_key: id,
});
export const portfolioSchema = z.object({
  title: text(160),
  category: z.enum(services),
  description: text(5000),
  image_url: safeUrl,
  project_url: safeUrl,
  is_published: z.boolean(),
});
export const reviewSchema = z.object({
  name: text(100),
  role: z.string().max(150),
  quote: text(2000),
  avatar_url: safeUrl,
  is_published: z.boolean(),
});
export const jobSchema = z.object({
  title: text(160),
  location: text(160),
  employment_type: z.enum(["Full-time", "Part-time", "Contract", "Internship"]),
  description: text(15000),
  is_open: z.boolean(),
});
export const statusSchema = z.object({
  status: z.enum(["new", "reviewed", "shortlisted", "closed"]),
  notes: z.string().max(5000).default(""),
});
export const contactStatusSchema = z.object({
  status: z.enum(["new", "in_progress", "closed"]),
  notes: z.string().max(5000).default(""),
});
export const schemas = {
  portfolio: portfolioSchema,
  reviews: reviewSchema,
  careers: jobSchema,
  applications: statusSchema,
  contacts: contactStatusSchema,
};
export type Resource = keyof typeof schemas;
export const tables = {
  portfolio: "portfolio",
  reviews: "reviews",
  careers: "job_postings",
  applications: "job_applications",
  contacts: "contact_submissions",
} as const;
