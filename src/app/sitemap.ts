import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/env";
import { publicContent } from "@/lib/services/public";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { jobs } = await publicContent();
  return [
    "",
    "/services",
    "/work",
    "/about",
    "/careers",
    "/contact",
    "/privacy",
    ...jobs.map((j) => `/careers/${j.id}`),
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: "monthly",
    priority: path ? 0.7 : 1,
  }));
}
