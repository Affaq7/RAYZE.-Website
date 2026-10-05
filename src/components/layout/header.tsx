"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
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
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const path = usePathname();
  const navContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close nav on route change
  const [prevPath, setPrevPath] = useState(path);
  if (prevPath !== path) {
    setPrevPath(path);
    setIsOpen(false);
  }

  // Close nav on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        navContainerRef.current &&
        !navContainerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const navItems = [
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Work", href: "/work" },
    { label: "Career", href: "/careers" },
  ];

  return (
    <header
      className={`site-header ${isScrolled ? "header-scrolled" : ""}`}
      onKeyDown={(e) => {
        if (e.key === "Escape") setIsOpen(false);
      }}
    >
      <div className="header-inner">
        {/* Left: Brand */}
        <Brand />

        {/* Right: Toggle button (3 lines by default; expands to navbar on click) */}
        <div
          ref={navContainerRef}
          className={`nav-pill-wrapper ${isOpen ? "is-expanded" : "is-collapsed"}`}
        >
          {/* Desktop expanded navigation pill */}
          {isOpen && (
            <nav id="main-nav" aria-label="Main" className="desktop-nav-pill">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="nav-pill-link"
                  aria-current={path === item.href ? "page" : undefined}
                  onClick={() => setIsOpen(false)}
                >
                  <span className="nav-glass-oval" aria-hidden="true" />
                  <span className="nav-pill-text">{item.label}</span>
                </Link>
              ))}

              <Link
                className="nav-pill-link nav-pill-cta"
                href="/contact"
                aria-current={path === "/contact" ? "page" : undefined}
                onClick={() => setIsOpen(false)}
              >
                <span className="nav-glass-oval nav-glass-oval-cta" aria-hidden="true" />
                <span className="nav-pill-text nav-cta-inner">
                  <span>Let’s talk</span>
                  <Arrow diagonal />
                </span>
              </Link>
            </nav>
          )}

          {/* 3 lines menu button (transforms to ✕ when open) */}
          <button
            type="button"
            className="nav-circle-btn"
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className={`menu-burger-icon ${isOpen ? "is-open" : ""}`} aria-hidden="true">
              <span className="burger-line" />
              <span className="burger-line" />
              <span className="burger-line" />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer (visible on small viewports when isOpen) */}
      {isOpen && (
        <nav className="mobile-nav-drawer" aria-label="Mobile Navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="mobile-nav-link"
              aria-current={path === item.href ? "page" : undefined}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="mobile-nav-link mobile-nav-cta"
            aria-current={path === "/contact" ? "page" : undefined}
            onClick={() => setIsOpen(false)}
          >
            <span>Let’s talk</span>
            <Arrow diagonal />
          </Link>
        </nav>
      )}
    </header>
  );
}

export default Header;
