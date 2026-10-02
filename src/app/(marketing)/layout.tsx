import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Motion } from "@/components/motion/motion";
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <Motion />
    </>
  );
}
