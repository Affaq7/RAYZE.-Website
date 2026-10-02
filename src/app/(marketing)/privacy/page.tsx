export const metadata = {
  title: "Privacy",
  description: "How RAYZE uses enquiry and application information.",
};
export default function Page() {
  return (
    <section className="wrap section prose legal">
      <p className="overline">— PRIVACY NOTICE</p>
      <h1>YOUR INFORMATION.</h1>
      <h2>What you share</h2>
      <p>
        Our enquiry form collects your name, email, company, selected service
        and message. Job applications collect your name, email, optional
        introduction and PDF resume.
      </p>
      <h2>Why we use it</h2>
      <p>
        RAYZE uses this information to respond to enquiries and review
        applications. Information is stored in Supabase. Resumes are stored
        privately and accessed only by authorized administrators using temporary
        download links.
      </p>
      <h2>Security and cookies</h2>
      <p>
        We use request limits to reduce spam. Admin sign-in uses essential
        session cookies. The public website does not include advertising
        trackers.
      </p>
      <h2>Questions or deletion requests</h2>
      <p>
        Use the <a href="/contact">contact form</a> to ask about your
        information or request its deletion. Include enough context to identify
        your previous submission without sending sensitive identity documents.
      </p>
    </section>
  );
}
