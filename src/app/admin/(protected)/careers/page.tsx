import { adminRows } from "@/lib/services/admin";
import { AdminManager } from "@/components/ui/admin-manager";
export default async function Page() {
  const rows = await adminRows("careers");
  return (
    <>
      <h1>careers</h1>
      <AdminManager resource="careers" initial={rows} />
    </>
  );
}
