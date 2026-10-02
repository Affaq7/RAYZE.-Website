import { NextResponse } from "next/server";
import { applicationSchema, id } from "@/lib/validation";
import { sameOrigin, failure, limitedFormData } from "@/lib/http";
import { rateLimit } from "@/lib/rate-limit";
import { saveApplication, MAX_PDF } from "@/lib/services/submissions";
import { HttpError } from "@/lib/auth";
export const runtime = "nodejs";
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    sameOrigin(request);
    const jobId = id.parse((await params).id);
    const form = await limitedFormData(request, MAX_PDF + 64000);
    if (form.get("website")) return NextResponse.json({ success: true });
    const { website, ...value } = applicationSchema.parse(
      Object.fromEntries(form),
    );
    void website;
    const file = form.get("resume");
    if (!(file instanceof File))
      throw new HttpError(400, "Please attach your PDF resume.");
    await rateLimit(request, "applications");
    await saveApplication(jobId, value, file);
    return NextResponse.json({ success: true });
  } catch (error) {
    return failure(error);
  }
}
