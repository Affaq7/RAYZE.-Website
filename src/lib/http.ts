import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { HttpError } from "@/lib/auth";
import { siteUrl } from "@/lib/env";
export function sameOrigin(request: Request) {
  if (request.headers.get("origin") !== new URL(siteUrl).origin)
    throw new HttpError(403, "Request origin is not allowed.");
}
export function failure(error: unknown) {
  if (error instanceof ZodError)
    return NextResponse.json(
      {
        error: error.issues
          .map((i) => `${i.path.join(".")}: ${i.message}`)
          .join("; "),
      },
      { status: 400 },
    );
  if (error instanceof HttpError)
    return NextResponse.json(
      { error: error.message },
      { status: error.status, headers: { "Cache-Control": "no-store" } },
    );
  return NextResponse.json(
    { error: "Unable to complete this request. Please try again later." },
    { status: 503 },
  );
}
export async function jsonBody(request: Request) {
  if (Number(request.headers.get("content-length") || 0) > 20000)
    throw new HttpError(413, "Request is too large.");
  const text = new TextDecoder().decode(await boundedBody(request,20000));
  try {
    return JSON.parse(text);
  } catch {
    throw new HttpError(400, "Invalid JSON.");
  }
}
async function boundedBody(request: Request, limit: number) {
  if (Number(request.headers.get("content-length") || 0) > limit)
    throw new HttpError(413, "Upload is too large.");
  const reader = request.body?.getReader();
  if (!reader) throw new HttpError(400, "Missing request body.");
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > limit) {
      await reader.cancel();
      throw new HttpError(413, "Upload is too large.");
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return bytes;
}
export async function limitedFormData(request: Request, limit: number) {
  const bytes=await boundedBody(request,limit);
  try {
    return await new Request(request.url, {
      method: "POST",
      headers: { "Content-Type": request.headers.get("content-type") || "" },
      body: bytes,
    }).formData();
  } catch {
    throw new HttpError(400, "Invalid upload request.");
  }
}
