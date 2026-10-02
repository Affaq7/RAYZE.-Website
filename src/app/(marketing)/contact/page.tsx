import {Arrow} from '@/components/ui/arrow';
import { PageHeading } from "@/components/sections/page-heading";
import { SubmissionForm } from "@/components/ui/submission-form";
export const metadata = {
  title: "Contact",
  description:
    "Tell RAYZE about your next branding, content, website or automation project.",
};
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service } = await searchParams;
  return (
    <>
      <PageHeading
        label="LET’S TALK"
        title="WHAT’S YOUR NEXT MOVE?"
        description="A clear brief or a rough idea. A fresh start or a new direction. Tell us where you want to go."
      />
      <section className="contact-layout wrap section">
        <aside>
          <h2>
            IT STARTS
            <br />
            WITH A<br />
            CONVERSATION.
          </h2>
          <p>
            Share a little about your business and what you have in mind. We’ll
            use your details to get back to you about the next step.
          </p>
          <span className="contact-arrow" aria-hidden="true">
            <Arrow diagonal/>
          </span>
        </aside>
        <SubmissionForm service={service} />
      </section>
    </>
  );
}
