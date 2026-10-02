"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/types";
import { safeUrl } from "@/lib/validation";
import { Arrow } from "@/components/ui/arrow";
export function WorkGrid({
  projects,
  filter = false,
}: {
  projects: Project[];
  filter?: boolean;
}) {
  const [category, setCategory] = useState("All");
  const list = projects.filter(
    (p) => category === "All" || p.category === category,
  );
  return (
    <>
      {filter && projects.length > 0 && (
        <div className="filters" aria-label="Filter projects">
          {["All", ...new Set(projects.map((p) => p.category))].map((c) => (
            <button
              key={c}
              aria-pressed={category === c}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
      )}
      {list.length ? (
        <div className="work-grid">
          {list.map((p) => (
            <article key={p.id} className="project">
              {p.image_url && safeUrl.safeParse(p.image_url).success && (
                <Image
                  unoptimized
                  src={p.image_url}
                  alt={p.title}
                  width={1200}
                  height={900}
                  loading="lazy"
                />
              )}
              <div className="project-meta">
                <div>
                  <p className="overline">{p.category}</p>
                  <h3>{p.title}</h3>
                </div>
                {p.project_url && safeUrl.safeParse(p.project_url).success && (
                  <a
                    href={p.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${p.title} (opens new tab)`}
                  >
                    <Arrow diagonal />
                  </a>
                )}
              </div>
              <p>{p.description}</p>
            </article>
          ))}
        </div>
      ) : (
        <div className="work-empty">
          <span className="empty-plus" aria-hidden="true">
            <Arrow diagonal/>
          </span>
          <div>
            <h3>
              THE NEXT THING
              <br />
              COULD BE YOURS.
            </h3>
            <p>
              Our project collection is being prepared.
              <br />
              In the meantime, let’s talk about what you have in mind.
            </p>
            <Link href="/contact" className="text-link">
              Start a conversation <Arrow />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
