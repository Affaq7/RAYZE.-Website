import { adminRows } from "@/lib/services/admin";
import { AdminManager } from "@/components/ui/admin-manager";
export default async function Page() {
  const rows = await adminRows("contacts");
  return (
    <>
      <h1>contacts</h1>
      <AdminManager resource="contacts" initial={rows} />
    </>
  );
}
