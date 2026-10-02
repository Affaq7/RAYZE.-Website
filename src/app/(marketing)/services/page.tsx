import { PageHeading } from "@/components/sections/page-heading";
import { Services } from "@/components/sections/services";
import { CTA } from "@/components/layout/footer";
export const metadata = {
  title: "Services",
  description:
    "Explore RAYZE’s six services: social media, logo and brand design, video, websites and automations.",
};
export default function Page() {
  return (
    <>
      <PageHeading
        label="WHAT WE DO"
        title="THE IDEA IS JUST THE START."
        description="Six connected disciplines. One clear direction for your brand. Choose where you need us, and we’ll shape the work around you."
      />
      <section className="wrap section full-services">
        <Services full />
      </section>
      <CTA />
    </>
  );
}
