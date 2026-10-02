import { NextResponse } from "next/server";
import { sameOrigin, failure } from "@/lib/http";
import { sessionClient } from "@/lib/supabase/server";
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    const { error } = await (await sessionClient()).auth.signOut();
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (e) {
    return failure(e);
  }
}
