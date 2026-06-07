export function SectionHeading({
  eyebrow,
  title,
  description
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-2xl">
      {eyebrow ? <p className="mb-3 text-sm font-medium uppercase tracking-wide opacity-70">{eyebrow}</p> : null}
      <h2 className="text-3xl font-semibold tracking-normal md:text-4xl">{title}</h2>
      {description ? <p className="mt-4 text-base leading-7 opacity-70">{description}</p> : null}
    </div>
  );
}
