import Link from "next/link";
import { PageHeading } from "@/components/sections/page-heading";
import { publicContent } from "@/lib/services/public";
import { Arrow } from "@/components/ui/arrow";
export const metadata = {
  title: "Careers",
  description:
    "Explore open roles at RAYZE and apply with a private PDF resume.",
};
export default async function Page() {
  const { jobs } = await publicContent();
  return (
    <>
      <PageHeading
        label="CAREERS"
        title="BRING YOUR POINT OF VIEW."
        description="Great creative work starts with people who see things differently. Explore opportunities to shape what comes next at RAYZE."
      />
      <section className="wrap section">
        <div className="section-heading">
          <h2>OPEN ROLES.</h2>
          <span>{jobs.length} opportunities</span>
        </div>
        {jobs.length ? (
          jobs.map((j) => (
            <Link className="job-row" href={`/careers/${j.id}`} key={j.id}>
              <div>
                <h3>{j.title}</h3>
                <p>
                  {j.location} · {j.employment_type}
                </p>
              </div>
              <Arrow diagonal />
            </Link>
          ))
        ) : (
          <div className="empty-state">
            <h3>No open roles right now.</h3>
            <p>
              New opportunities will appear here when applications open. Thank
              you for your interest in RAYZE.
            </p>
            <Link className="text-link" href="/about">
              Get to know us <Arrow />
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
