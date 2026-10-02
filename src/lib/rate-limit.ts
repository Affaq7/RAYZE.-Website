import "server-only";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { createHash } from "node:crypto";
import { HttpError } from "@/lib/auth";
export async function rateLimit(request: Request, endpoint: string) {
  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  )
    throw new HttpError(
      503,
      "Submissions are temporarily unavailable. Please try again later.",
    );
  const ip = process.env.VERCEL
    ? request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim()
    : "local-development";
  if (!ip) throw new HttpError(503, "Unable to verify this request.");
  const limiter = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(5, "1 h"),
    prefix: `rayze:${endpoint}`,
    analytics: false,
  });
  const result = await limiter.limit(
    createHash("sha256").update(ip).digest("hex"),
  );
  if (!result.success)
    throw new HttpError(429, "Too many requests. Please try again in an hour.");
}
