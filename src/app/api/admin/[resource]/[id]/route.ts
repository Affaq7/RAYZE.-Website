import { NextResponse } from "next/server";
import { requireAdmin, HttpError } from "@/lib/auth";
import { privileged } from "@/lib/supabase/admin";
import { id, schemas, tables } from "@/lib/validation";
import { failure, sameOrigin, jsonBody } from "@/lib/http";
import { resourceOf } from "../route";
type Context = { params: Promise<{ resource: string; id: string }> };
export async function PATCH(request: Request, { params }: Context) {
  try {
    sameOrigin(request);
    await requireAdmin();
    const p = await params;
    const resource = resourceOf(p.resource);
    const key = id.parse(p.id);
    const value = schemas[resource].parse(await jsonBody(request));
    const { data, error } = await privileged()
      .from(tables[resource])
      .update(value)
      .eq("id", key)
      .select("id")
      .single();
    if (error || !data)
      throw new HttpError(404, "Record not found or update failed.");
    return NextResponse.json({ success: true });
  } catch (e) {
    return failure(e);
  }
}
export async function DELETE(request: Request, { params }: Context) {
  try {
    sameOrigin(request);
    await requireAdmin();
    const p = await params;
    const resource = resourceOf(p.resource);
    const key = id.parse(p.id);
    const db = privileged();
    if (resource === "applications") {
      const { data, error } = await db
        .from("job_applications")
        .select("resume_path")
        .eq("id", key)
        .single();
      if (error) throw error;
      if (data.resume_path) {
        const { error: e } = await db.storage
          .from(process.env.SUPABASE_RESUME_BUCKET!)
          .remove([data.resume_path]);
        if (e) throw e;
      }
    }
    const { error } = await db.from(tables[resource]).delete().eq("id", key);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (e) {
    return failure(e);
  }
}
