import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation";
import { sameOrigin, failure, jsonBody } from "@/lib/http";
import { rateLimit } from "@/lib/rate-limit";
import { saveContact } from "@/lib/services/submissions";
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    const raw = await jsonBody(request);
    if (typeof raw.website === "string" && raw.website)
      return NextResponse.json({ success: true });
    const { website, ...value } = contactSchema.parse(raw);
    void website;
    await rateLimit(request, "contact");
    await saveContact(value);
    return NextResponse.json({ success: true });
  } catch (error) {
    return failure(error);
  }
}
