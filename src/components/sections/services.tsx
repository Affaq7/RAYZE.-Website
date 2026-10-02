import Link from "next/link";
import { serviceDetails } from "@/lib/content";
import { Arrow } from "@/components/ui/arrow";
export function Services({ full = false }: { full?: boolean }) {
  return (
    <div className="service-list">
      {serviceDetails.map((s, i) => (
        <article className="service-row" key={s.name} id={`service-${i}`}>
          <span className="service-number">0{i + 1}</span>
          <div>
            <h3>{s.name}</h3>
            {full && (
              <>
                <p className="service-line">{s.line}</p>
                <p>{s.description}</p>
                <ul>
                  {s.deliverables.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
          <Link
            href={`/contact?service=${encodeURIComponent(s.name)}`}
            aria-label={`Enquire about ${s.name}`}
            className="service-link"
          >
            <Arrow diagonal />
          </Link>
        </article>
      ))}
    </div>
  );
}
