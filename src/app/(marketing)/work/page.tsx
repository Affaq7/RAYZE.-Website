import { PageHeading } from "@/components/sections/page-heading";
import { WorkGrid } from "@/components/sections/work";
import { ReviewsSection } from "@/components/sections/reviews";
import { publicContent } from "@/lib/services/public";
import { CTA } from "@/components/layout/footer";
export const metadata = {
  title: "Work",
  description:
    "Explore published brand, content and digital projects from RAYZE.",
};
export default async function Page() {
  const { projects } = await publicContent();
  return (
    <>
      <PageHeading
        label="OUR WORK"
        title="IDEAS. OUT IN THE WORLD."
        description="Brand, content and digital work. Different disciplines, connected by a considered point of view."
      />
      <section className="wrap section">
        <WorkGrid projects={projects} filter />
      </section>
      <ReviewsSection />
      <CTA />
    </>
  );
}
