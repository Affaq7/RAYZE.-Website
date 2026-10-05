import Link from "next/link";
import { Arrow } from "@/components/ui/arrow";
import { ServicesStack } from "@/components/sections/services-stack";
import { WorkGrid } from "@/components/sections/work";
import { Hero } from "@/components/sections/hero";
import { publicContent } from "@/lib/services/public";

export default async function Home() {
  const { projects, reviews } = await publicContent();
  const demoReview = reviews.length === 0 && process.env.SHOW_DEMO_REVIEW !== "false";
  const displayedReviews = demoReview ? [{
    id: "demo-review",
    name: "Sample client",
    role: "Demo review · Not a real testimonial",
    quote: "Working with RAYZE felt clear, collaborative and considered—from the first idea to the final details.",
  }] : reviews;

  return (
    <>
      <Hero />
      <section id="intro" className="intro wrap section" data-reveal>
        <p className="overline">— A CREATIVE PARTNER FOR WHAT’S NEXT</p>
        <div>
          <h2>
            GOOD IDEAS
            <br />
            DESERVE TO
            <br />
            <span className="muted">GO FURTHER.</span>
          </h2>
          <p>
            RAYZE is a media marketing agency. We connect strategy, design and
            technology to give your brand a clear voice—and the tools to carry
            it forward.
          </p>
          <Link href="/about" className="text-link">
            Meet RAYZE <Arrow />
          </Link>
        </div>
      </section>
      <section className="wrap section work-section" data-reveal>
        <div className="section-heading">
          <div>
            <p className="overline">— WORK IN FOCUS</p>
            <h2>
              MADE TO
              <br />
              MAKE A MARK.
            </h2>
          </div>
          <Link className="text-link" href="/work">
            Explore our work <Arrow />
          </Link>
        </div>
        <WorkGrid projects={projects.slice(0, 4)} />
      </section>
      <ServicesStack />
      <section className="process wrap section" data-reveal>
        <div>
          <p className="overline">— FROM IDEA TO IMPACT</p>
          <h2>
            BIG THINKING.
            <br />
            CLEAR PROCESS.
          </h2>
        </div>
        <ol>
          {[
            [
              "Understand",
              "Start with your business, your audience and the problem worth solving.",
            ],
            [
              "Create",
              "Turn a focused direction into considered design, content and experiences.",
            ],
            [
              "Move forward",
              "Refine the details, launch with care and give you the tools to keep going.",
            ],
          ].map(([title, desc], i) => (
            <li key={title}>
              <span>0{i + 1}</span>
              <div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
      {displayedReviews.length > 0 && (
        <section className="wrap section reviews">
          <p className="overline">{demoReview ? "— DEMO REVIEW / PREVIEW ONLY" : "— IN THEIR WORDS"}</p>
          <h2>
            GOOD WORK.
            <br />
            {demoReview ? "CLEAR FEEDBACK." : "REAL CONNECTIONS."}
          </h2>
          {displayedReviews.map((r) => (
            <figure key={r.id}>
              <blockquote>“{r.quote}”</blockquote>
              <figcaption>
                {r.name} · {r.role}
              </figcaption>
            </figure>
          ))}
        </section>
      )}
    </>
  );
}
