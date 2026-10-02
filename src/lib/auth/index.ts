import "server-only";
import { sessionClient } from "@/lib/supabase/server";
import { configured } from "@/lib/env";
export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
export async function requireAdmin() {
  if (!configured()) throw new HttpError(503, "Admin is not configured.");
  const client = await sessionClient();
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) throw new HttpError(401, "Sign in to continue.");
  const ids = (process.env.ADMIN_USER_IDS || "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
  if (!ids.includes(data.user.id))
    throw new HttpError(403, "This account does not have admin access.");
  return data.user;
}
