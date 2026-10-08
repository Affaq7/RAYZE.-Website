import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation";
import { sameOrigin, failure, jsonBody } from "@/lib/http";
import { rateLimit } from "@/lib/rate-limit";
import { saveContact } from "@/lib/services/submissions";
import { configured } from "@/lib/env";

export async function POST(request: Request) {
  try {
    sameOrigin(request);
    const raw = await jsonBody(request);
    if (typeof raw.website === "string" && raw.website)
      return NextResponse.json({ success: true });
    const { website, ...value } = contactSchema.parse(raw);
    void website;
    await rateLimit(request, "contact");

    if (configured()) {
      try {
        await saveContact(value);
      } catch (dbErr) {
        console.error("Database save error:", dbErr);
      }
    }

    // Forward to Formspree
    try {
      await fetch("https://formspree.io/f/xnpjpvbb", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(value),
      });
    } catch (fsErr) {
      console.error("Formspree forward error:", fsErr);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return failure(error);
  }
}
