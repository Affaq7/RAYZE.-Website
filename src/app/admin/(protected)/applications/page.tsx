import { adminRows } from "@/lib/services/admin";
import { AdminManager } from "@/components/ui/admin-manager";
export default async function Page() {
  const rows = await adminRows("applications");
  return (
    <>
      <h1>applications</h1>
      <AdminManager resource="applications" initial={rows} />
    </>
  );
}
