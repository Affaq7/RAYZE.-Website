"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="wrap section">
      <h1>
        A BRIEF
        <br />
        INTERRUPTION.
      </h1>
      <p>We couldn’t load this content. Please try again.</p>
      <button className="button" onClick={reset}>
        Try again
      </button>
    </section>
  );
}
