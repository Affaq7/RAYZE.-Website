import { adminRows } from "@/lib/services/admin";
import { AdminManager } from "@/components/ui/admin-manager";
export default async function Page() {
  const rows = await adminRows("portfolio");
  return (
    <>
      <h1>portfolio</h1>
      <AdminManager resource="portfolio" initial={rows} />
    </>
  );
}
