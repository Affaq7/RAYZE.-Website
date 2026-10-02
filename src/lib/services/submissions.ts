import "server-only";
import { createHash, randomUUID } from "node:crypto";
import { privileged } from "@/lib/supabase/admin";
import { HttpError } from "@/lib/auth";
import { privateResumeBucket } from "@/lib/services/storage";
export const MAX_PDF = 3 * 1024 * 1024;
export async function validatePdf(file: File) {
  if (
    file.size === 0 ||
    file.size > MAX_PDF ||
    file.type !== "application/pdf" ||
    !file.name.toLowerCase().endsWith(".pdf") ||
    file.name.length > 180 ||
    /[\/\\\x00-\x1f]/.test(file.name)
  )
    throw new HttpError(
      400,
      "Upload a PDF resume up to 3 MB with a valid filename.",
    );
  const bytes = Buffer.from(await file.arrayBuffer());
  if (bytes.subarray(0, 5).toString() !== "%PDF-")
    throw new HttpError(400, "The resume must be a valid PDF file.");
  return bytes;
}
export function fingerprint(value: unknown) {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}
export async function saveContact(value: {
  idempotency_key: string;
  [key: string]: unknown;
}) {
  const db = privileged();
  const hash = fingerprint(value);
  const { error } = await db
    .from("contact_submissions")
    .insert({ ...value, payload_hash: hash });
  if (error?.code === "23505") {
    const { data } = await db
      .from("contact_submissions")
      .select("payload_hash")
      .eq("idempotency_key", value.idempotency_key)
      .single();
    if (data?.payload_hash === hash) return;
    throw new HttpError(
      409,
      "This request has already been used. Refresh the form.",
    );
  }
  if (error) throw error;
}
export async function saveApplication(
  jobId: string,
  value: { idempotency_key: string; [key: string]: unknown },
  file: File,
) {
  const bytes = await validatePdf(file);
  const db = privileged();
  const hash = fingerprint({
    ...value,
    jobId,
    file: createHash("sha256").update(bytes).digest("hex"),
  });
  const { data: existing } = await db
    .from("job_applications")
    .select("payload_hash")
    .eq("idempotency_key", value.idempotency_key)
    .maybeSingle();
  if (existing) {
    if (existing.payload_hash === hash) return;
    throw new HttpError(
      409,
      "This request has already been used. Refresh the form.",
    );
  }
  const { data: job, error: jobError } = await db
    .from("job_postings")
    .select("id")
    .eq("id", jobId)
    .eq("is_open", true)
    .maybeSingle();
  if (jobError) throw jobError;
  if (!job)
    throw new HttpError(409, "This role is no longer accepting applications.");
  const bucket = await privateResumeBucket();
  const path = `${jobId}/${randomUUID()}.pdf`;
  const { error: uploadError } = await db.storage
    .from(bucket)
    .upload(path, bytes, { contentType: "application/pdf", upsert: false });
  if (uploadError) throw uploadError;
  const { error } = await db.rpc("submit_job_application", {
    p_job_id: jobId,
    p_name: value.name,
    p_email: value.email,
    p_cover_letter: value.cover_letter,
    p_resume_path: path,
    p_idempotency_key: value.idempotency_key,
    p_payload_hash: hash,
  });
  if (error) {
    const { error: cleanupError } = await db.storage
      .from(bucket)
      .remove([path]);
    if (cleanupError)
      console.error(
        "Resume cleanup failed; inspect orphan objects in private storage.",
      );
    if (error.code === "23505") {
      const { data } = await db
        .from("job_applications")
        .select("payload_hash")
        .eq("idempotency_key", value.idempotency_key)
        .single();
      if (data?.payload_hash === hash) return;
    }
    if (error.message.includes("ROLE_CLOSED"))
      throw new HttpError(
        409,
        "This role is no longer accepting applications.",
      );
    throw error;
  }
}
