import "server-only";
import { createClient } from "@supabase/supabase-js";
import { required } from "@/lib/env";
export function privileged() {
  return createClient(
    required("NEXT_PUBLIC_SUPABASE_URL"),
    required("SUPABASE_SERVICE_ROLE_KEY"),
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
