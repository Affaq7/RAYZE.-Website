"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brand } from "./header";
import { Arrow } from "@/components/ui/arrow";
import { AsciiFooter } from "@/components/sections/ascii-footer";

export function CTA() {
  return (
    <section className="cta">
      <div className="cta-inner">
        <p className="overline">— YOUR NEXT CHAPTER</p>
        <Link href="/contact" className="cta-link-headline">
          <h2>
            READY TO
            <br />
            RISE?
          </h2>
          <Arrow diagonal />
        </Link>
        <p className="cta-sub">Let’s build something worth remembering.</p>
      </div>
    </section>
  );
}

export function Footer() {
  const pathname = usePathname();

  if (pathname === "/") {
    return <AsciiFooter />;
  }
  const serviceLinks = [
    { label: "Identity", href: "/services" },
    { label: "Content", href: "/services" },
    { label: "Digital", href: "/services" },
    { label: "Strategy", href: "/services" },
  ];

  const socialLinks = [
    { label: "Instagram", href: "https://www.instagram.com/rayze.studio/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/workwithrayze" },
    { label: "Facebook", href: "https://www.facebook.com/share/19h7SSKu4j/" },
    { label: "TikTok", href: "https://www.tiktok.com/@rayze.co" },
  ];

  return (
    <footer className="footer">
      <div className="footer-grid">
        {/* Brand & Tagline */}
        <div className="footer-col-brand">
          <Brand />
          <p className="footer-tagline">Rise with RAYZE.</p>
        </div>

        {/* Services Navigation */}
        <div className="footer-col">
          <span className="footer-heading">Services</span>
          <nav aria-label="Footer Services">
            {serviceLinks.map((s) => (
              <Link key={s.label} href={s.href}>
                {s.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Socials */}
        <div className="footer-col">
          <span className="footer-heading">Connect</span>
          <nav aria-label="Footer Socials">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {s.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Contact */}
        <div className="footer-col">
          <span className="footer-heading">Get in touch</span>
          <a
            href="mailto:workwithrayze@gmail.com"
            className="footer-contact-link"
          >
            workwithrayze@gmail.com
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 RAYZE. All rights reserved.</span>
        <span>Rise with RAYZE.</span>
        <Link href="/privacy">Privacy</Link>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  );
}
