import Link from "next/link";
import { Brand } from "./header";
import { Arrow } from "@/components/ui/arrow";
export function CTA() {
  return (
    <section className="cta">
      <p className="overline">— YOUR NEXT CHAPTER</p>
      <Link href="/contact">
        <h2>
          LET’S MAKE
          <br />
          SOMETHING MATTER.
        </h2>
        <Arrow diagonal />
      </Link>
      <p>A new brand. A better website. An idea ready to move.</p>
    </section>
  );
}
export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <Brand />
        <p>
          Creative thinking.
          <br />
          Forward motion.
        </p>
        <nav aria-label="Footer">
          <Link href="/services">Services</Link>
          <Link href="/work">Work</Link>
          <Link href="/about">About</Link>
          <Link href="/careers">Careers</Link>
          <Link href="/contact">Contact</Link>
        </nav>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} RAYZE.</span>
        <span>Rise with RAYZE.</span>
        <Link href="/privacy">Privacy</Link>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  );
}
