import Image from "next/image";
import Link from "next/link";
import { Arrow } from "@/components/ui/arrow";
import { CTA } from "@/components/layout/footer";
import { Services } from "@/components/sections/services";
import { WorkGrid } from "@/components/sections/work";
import { Marquee, MotionControl } from "@/components/motion/motion";
import { publicContent } from "@/lib/services/public";
export default async function Home() {
  const { projects, reviews } = await publicContent();
  return (
    <>
      <section className="hero wrap">
        <div className="hero-top">
          <p className="overline">
            — INDEPENDENT THINKING. CONNECTED CREATIVITY.
          </p>
          <span className="hero-index">BRAND / CONTENT / DIGITAL</span>
        </div>
        <div className="hero-main">
          <h1>
            RISE WITH
            <br />
            <span>RAYZE.</span>
          </h1>
          <div className="hero-mark">
            <Image
              src="/logos/mark-red.png"
              alt=""
              width={419}
              height={403}
              priority
            />
            <span className="mark-caption">BUILT TO MOVE YOU FORWARD.</span>
          </div>
        </div>
        <div className="hero-bottom">
          <p>
            We turn bold thinking into brands,
            <br />
            content and digital experiences
            <br />
            that move your business forward.
          </p>
          <Link className="button" href="/contact">
            Start a project <Arrow diagonal />
          </Link>
          <div className="hero-scroll">
            <MotionControl />
            <a href="#intro">Explore RAYZE ↓</a>
          </div>
        </div>
      </section>
      <Marquee />
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
      <section className="wrap section services-section">
        <div className="section-heading">
          <div>
            <p className="overline">— WHAT WE DO</p>
            <h2>
              SIX WAYS
              <br />
              TO RISE.
            </h2>
          </div>
          <p>
            From the first impression
            <br />
            to the systems behind it.
          </p>
        </div>
        <Services />
        <Link className="text-link services-all" href="/services">
          Explore the services <Arrow />
        </Link>
      </section>
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
      {reviews.length > 0 && (
        <section className="wrap section reviews">
          <p className="overline">— IN THEIR WORDS</p>
          <h2>
            GOOD WORK.
            <br />
            REAL CONNECTIONS.
          </h2>
          {reviews.map((r) => (
            <figure key={r.id}>
              <blockquote>“{r.quote}”</blockquote>
              <figcaption>
                {r.name} · {r.role}
              </figcaption>
            </figure>
          ))}
        </section>
      )}
      <CTA />
    </>
  );
}
