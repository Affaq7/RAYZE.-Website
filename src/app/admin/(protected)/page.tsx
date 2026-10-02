import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
export default async function Page() {
  await requireAdmin();
  return (
    <>
      <p className="overline">— RAYZE WORKSPACE</p>
      <h1>YOUR NEXT MOVE.</h1>
      <p>Manage what the world sees, and the conversations it starts.</p>
      <div className="admin-overview">
        {[
          ["portfolio", "Publish projects and their original links."],
          ["reviews", "Manage approved client feedback."],
          ["careers", "Create, edit and close open roles."],
          ["applications", "Review applications and download private resumes."],
          ["contacts", "Follow up on project enquiries."],
        ].map(([r, d]) => (
          <Link key={r} href={`/admin/${r}`}>
            <h2>{r}</h2>
            <p>{d}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
