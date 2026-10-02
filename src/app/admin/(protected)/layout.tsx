import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin, HttpError } from "@/lib/auth";
import { Brand } from "@/components/layout/header";
import { Logout } from "@/components/ui/login-form";
export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    await requireAdmin();
  } catch (e) {
    if (e instanceof HttpError) redirect("/admin/login");
    throw e;
  }
  return (
    <>
      <header className="admin-header">
        <Brand />
        <span>Workspace</span>
        <Logout />
      </header>
      <div className="admin-shell">
        <nav aria-label="Admin">
          <Link href="/admin">Overview</Link>
          {["portfolio", "reviews", "careers", "applications", "contacts"].map(
            (r) => (
              <Link key={r} href={`/admin/${r}`}>
                {r}
              </Link>
            ),
          )}
        </nav>
        <main id="main" className="admin-main">
          {children}
        </main>
      </div>
    </>
  );
}
