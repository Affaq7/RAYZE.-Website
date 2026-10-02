import "server-only";
import { privileged } from "@/lib/supabase/admin";
import { configured } from "@/lib/env";
import type { Project, Review, Job } from "@/types";
export async function publicContent() {
  if (!configured())
    return {
      projects: [] as Project[],
      reviews: [] as Review[],
      jobs: [] as Job[],
      available: false,
    };
  const db = privileged();
  const [p, r, j] = await Promise.all([
    db
      .from("portfolio")
      .select("id,title,category,description,image_url,project_url")
      .eq("is_published", true)
      .order("created_at", { ascending: false }),
    db
      .from("reviews")
      .select("id,name,role,quote,avatar_url")
      .eq("is_published", true),
    db
      .from("job_postings")
      .select("id,title,location,employment_type,description")
      .eq("is_open", true)
      .order("created_at", { ascending: false }),
  ]);
  if (p.error || r.error || j.error) throw new Error("Content unavailable");
  return {
    projects: p.data as Project[],
    reviews: r.data as Review[],
    jobs: j.data as Job[],
    available: true,
  };
}
