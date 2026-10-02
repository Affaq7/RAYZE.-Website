import { notFound } from "next/navigation";
import Link from "next/link";
import { publicContent } from "@/lib/services/public";
import { SubmissionForm } from "@/components/ui/submission-form";
import { id } from "@/lib/validation";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const key = (await params).id;
  const { jobs } = await publicContent();
  return { title: jobs.find((j) => j.id === key)?.title || "Role unavailable" };
}
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const key = (await params).id;
  if (!id.safeParse(key).success) notFound();
  const { jobs } = await publicContent();
  const job = jobs.find((j) => j.id === key);
  if (!job) notFound();
  return (
    <>
      <section className="page-heading wrap">
        <Link className="text-link" href="/careers">
          ← All open roles
        </Link>
        <p className="overline">
          {job.location} / {job.employment_type}
        </p>
        <h1>{job.title}</h1>
      </section>
      <section className="wrap section job-detail">
        <div className="prose">
          <h2>THE ROLE.</h2>
          <p className="preserve-lines">{job.description}</p>
        </div>
        <div>
          <h2>MAKE YOUR INTRODUCTION.</h2>
          <SubmissionForm jobId={job.id} />
        </div>
      </section>
    </>
  );
}
