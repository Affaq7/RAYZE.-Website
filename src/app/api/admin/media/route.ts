import { NextResponse } from "next/server";
import sharp from "sharp";
import { randomUUID } from "node:crypto";
import { requireAdmin, HttpError } from "@/lib/auth";
import { privileged } from "@/lib/supabase/admin";
import { failure, sameOrigin, limitedFormData } from "@/lib/http";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    await requireAdmin();
    const file = (await limitedFormData(request, 3145728 + 64000)).get("file");
    if (
      !(file instanceof File) ||
      file.size > 3145728 ||
      !["image/jpeg", "image/png", "image/webp"].includes(file.type)
    )
      throw new HttpError(400, "Choose a JPEG, PNG or WebP under 3 MB.");
    const buffer = await sharp(Buffer.from(await file.arrayBuffer()), {
      limitInputPixels: 25000000,
    })
      .rotate()
      .resize({ width: 2000, withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer();
    const db = privileged();
    const bucket = process.env.SUPABASE_PORTFOLIO_BUCKET!;
    const path = `media/${randomUUID()}.webp`;
    const { error } = await db.storage
      .from(bucket)
      .upload(path, buffer, { contentType: "image/webp", upsert: false });
    if (error) throw error;
    return NextResponse.json({
      url: db.storage.from(bucket).getPublicUrl(path).data.publicUrl,
    });
  } catch (e) {
    return failure(e);
  }
}
