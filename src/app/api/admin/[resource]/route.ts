import { NextResponse } from "next/server";
import { requireAdmin, HttpError } from "@/lib/auth";
import { privileged } from "@/lib/supabase/admin";
import { schemas, tables, type Resource } from "@/lib/validation";
import { failure, sameOrigin, jsonBody } from "@/lib/http";
import { adminRows } from "@/lib/services/admin";
export function resourceOf(value: string): Resource {
  if (!Object.hasOwn(tables, value)) throw new HttpError(404, "Not found.");
  return value as Resource;
}
export async function GET(
  request: Request,
  { params }: { params: Promise<{ resource: string }> },
) {
  try {
    await requireAdmin();
    const offset = Number(new URL(request.url).searchParams.get("offset") || 0);
    if (!Number.isSafeInteger(offset) || offset < 0)
      throw new HttpError(400, "Invalid page.");
    return NextResponse.json(
      await adminRows(resourceOf((await params).resource), offset),
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (e) {
    return failure(e);
  }
}
export async function POST(
  request: Request,
  { params }: { params: Promise<{ resource: string }> },
) {
  try {
    sameOrigin(request);
    await requireAdmin();
    const resource = resourceOf((await params).resource);
    if (resource === "applications" || resource === "contacts")
      throw new HttpError(405, "Submissions cannot be created here.");
    const value = schemas[resource].parse(await jsonBody(request));
    const { error } = await privileged()
      .from(tables[resource])
      .insert(value as Record<string, unknown>);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (e) {
    return failure(e);
  }
}
