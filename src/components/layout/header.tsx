"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { Arrow } from "@/components/ui/arrow";
export function Brand() {
  return (
    <Link className="brand" href="/" aria-label="RAYZE home">
      <Image src="/logos/mark-red.png" width={35} height={34} alt="" priority />
      <span>RAYZE.</span>
    </Link>
  );
}
export function Header() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const menuButton=useRef<HTMLButtonElement>(null);
  return (
    <header className="site-header" onKeyDown={(e) => {
      if (e.key === "Escape") { setOpen(false); menuButton.current?.focus(); }
    }}>
      <Brand />
      <button
        ref={menuButton}
        className="menu-toggle"
        aria-expanded={open}
        aria-controls="main-nav"
        onClick={() => setOpen(!open)}
      >
        {open ? "Close" : "Menu"}
        <span aria-hidden="true">{open ? "−" : "+"}</span>
      </button>
      <nav
        id="main-nav"
        aria-label="Main"
        className={open ? "nav open" : "nav"}
      >
        {[
          ["Services", "/services"],
          ["Work", "/work"],
          ["About", "/about"],
          ["Careers", "/careers"],
        ].map(([label, href]) => (
          <Link
            key={href}
            href={href}
            aria-current={path === href ? "page" : undefined}
            onClick={() => setOpen(false)}
          >
            {label}
          </Link>
        ))}
        <Link
          className="nav-cta"
          href="/contact"
          onClick={() => setOpen(false)}
        >
          Let’s talk <Arrow diagonal />
        </Link>
      </nav>
    </header>
  );
}
