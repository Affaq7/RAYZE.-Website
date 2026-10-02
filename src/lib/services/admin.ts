import "server-only";
import { requireAdmin } from "@/lib/auth";
import { privileged } from "@/lib/supabase/admin";
import { tables, type Resource } from "@/lib/validation";
export async function adminRows(resource: Resource, offset = 0) {
  await requireAdmin();
  const { data, error } = await privileged()
    .from(tables[resource])
    .select("*")
    .order("created_at", { ascending: false })
    .order("id")
    .range(offset, offset + 49);
  if (error) throw error;
  return data;
}
