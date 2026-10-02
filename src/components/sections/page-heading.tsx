export function PageHeading({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description: string;
}) {
  return (
    <section className="page-heading wrap">
      <p className="overline">— {label}</p>
      <h1>{title}</h1>
      <p className="page-description">{description}</p>
    </section>
  );
}
