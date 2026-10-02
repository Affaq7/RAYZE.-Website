import type { Metadata } from "next";
import localFont from "next/font/local";
import { siteUrl } from "@/lib/env";
import "./globals.css";
import { Motion } from "@/components/motion/motion";
import { PageTransition } from "@/components/motion/page-transition";
const inter = localFont({
  src: "../../public/fonts/inter-latin-wght-normal.woff2",
  weight: "100 900",
  variable: "--font-inter",
  display: "swap",
});
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "RAYZE — Rise with RAYZE.", template: "%s — RAYZE" },
  description:
    "RAYZE is a media marketing agency connecting brand design, content, websites and automation. Rise with RAYZE.",
  openGraph: {
    title: "RAYZE — Rise with RAYZE.",
    description: "Creative thinking. Forward motion.",
    images: ["/images/social.png"],
    type: "website",
  },
  twitter: { card: "summary_large_image", images: ["/images/social.png"] },
  icons: { icon: "/icon.png", apple: "/apple-icon.png" },
};
export const dynamic = "force-dynamic";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body id="top">
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <PageTransition>{children}</PageTransition>
        <Motion />
      </body>
    </html>
  );
}
