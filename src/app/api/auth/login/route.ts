import { NextResponse } from "next/server";
import { z } from "zod";
import { sameOrigin, failure, jsonBody } from "@/lib/http";
import { sessionClient } from "@/lib/supabase/server";
import { requireAdmin, HttpError } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    await rateLimit(request, "login");
    const input = z
      .object({ email: z.email(), password: z.string().min(1).max(200) })
      .parse(await jsonBody(request));
    const client = await sessionClient();
    const { error } = await client.auth.signInWithPassword(input);
    if (error) throw new HttpError(401, "Email or password is incorrect.");
    try {
      await requireAdmin();
    } catch (e) {
      await client.auth.signOut();
      throw e;
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    return failure(e);
  }
}
