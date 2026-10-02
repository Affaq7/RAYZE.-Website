import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="wrap section error-page">
      <p className="overline">— 404</p>
      <h1>
        A DIFFERENT
        <br />
        DIRECTION.
      </h1>
      <p>This page may have moved, or this role is no longer available.</p>
      <Link className="button" href="/">
        Back to RAYZE
      </Link>
    </main>
  );
}
