import { PageHeading } from "@/components/sections/page-heading";
import { CTA } from "@/components/layout/footer";
import Image from "next/image";
export const metadata = {
  title: "About",
  description:
    "Meet RAYZE, a media marketing agency connecting creative thinking with practical execution.",
};
export default function Page() {
  return (
    <>
      <PageHeading
        label="THIS IS RAYZE"
        title="CREATIVE THINKING. FORWARD MOTION."
        description="We’re a media marketing agency built around a simple idea: your brand should move with purpose."
      />
      <section className="about-statement wrap section">
        <div className="about-mark">
          <Image
            src="/logos/mark-red.png"
            width={419}
            height={403}
            alt="RAYZE angular R mark"
          />
        </div>
        <div>
          <h2>
            SEE THE
            <br />
            WHOLE PICTURE.
          </h2>
          <p>
            A logo is the beginning of an identity. A post is part of a bigger
            conversation. A website is the place where that conversation becomes
            an opportunity.
          </p>
          <p>
            We bring those pieces together. RAYZE connects social media, brand
            design, video, websites and automation so your business can show up
            with clarity and consistency.
          </p>
        </div>
      </section>
      <section className="wrap section values">
        <p className="overline">— HOW WE APPROACH THE WORK</p>
        <h2>
          INTENTION IN
          <br />
          EVERY DETAIL.
        </h2>
        <div>
          <article>
            <h3>Clarity first.</h3>
            <p>
              Understand the brief before reaching for a solution. Keep the
              message focused and the next step clear.
            </p>
          </article>
          <article>
            <h3>Make it yours.</h3>
            <p>
              Build from the character of your business. Give every creative
              decision a reason to exist.
            </p>
          </article>
          <article>
            <h3>Built for use.</h3>
            <p>
              Pair expressive ideas with practical execution. The work should
              look right and work right.
            </p>
          </article>
        </div>
      </section>
      <CTA />
    </>
  );
}
