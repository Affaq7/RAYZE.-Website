import "server-only";
import { privileged } from "@/lib/supabase/admin";
import { required } from "@/lib/env";
import { HttpError } from "@/lib/auth";
export async function privateResumeBucket() {
  const bucket = required("SUPABASE_RESUME_BUCKET");
  const { data, error } = await privileged().storage.getBucket(bucket);
  if (error || !data || data.public)
    throw new HttpError(
      503,
      "Private resume storage is unavailable. Please try again later.",
    );
  return bucket;
}
