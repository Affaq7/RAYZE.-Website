import { NextResponse } from "next/server";
import { requireAdmin, HttpError } from "@/lib/auth";
import { privileged } from "@/lib/supabase/admin";
import { id } from "@/lib/validation";
import { failure } from "@/lib/http";
import { privateResumeBucket } from "@/lib/services/storage";
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const key = id.parse((await params).id);
    const db = privileged();
    const { data, error } = await db
      .from("job_applications")
      .select("resume_path")
      .eq("id", key)
      .single();
    if (error || !data) throw new HttpError(404, "Resume not found.");
    const result = await db.storage
      .from(await privateResumeBucket())
      .createSignedUrl(data.resume_path, 300, { download: "resume.pdf" });
    if (result.error) throw result.error;
    return NextResponse.json(
      { url: result.data.signedUrl },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (e) {
    return failure(e);
  }
}
