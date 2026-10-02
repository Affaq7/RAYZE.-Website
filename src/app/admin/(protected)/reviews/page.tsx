import { adminRows } from "@/lib/services/admin";
import { AdminManager } from "@/components/ui/admin-manager";
export default async function Page() {
  const rows = await adminRows("reviews");
  return (
    <>
      <h1>reviews</h1>
      <AdminManager resource="reviews" initial={rows} />
    </>
  );
}
