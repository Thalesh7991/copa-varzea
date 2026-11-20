import Link from "next/link";

interface Props {
  eyebrow: string;
  titulo: React.ReactNode;
  href?: string;
  linkLabel?: string;
  className?: string;
}

export default function SectionTitle({ eyebrow, titulo, href, linkLabel = "Ver tudo", className = "" }: Props) {
  return (
    <div className={`mb-8 flex flex-wrap items-end justify-between gap-4 ${className}`}>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-2 font-display text-5xl leading-none tracking-wide sm:text-6xl">{titulo}</h2>
      </div>
      {href && (
        <Link href={href} className="group inline-flex items-center gap-2 font-cond text-sm font-semibold uppercase tracking-[0.18em] text-muted hover:text-gold">
          {linkLabel}
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </Link>
      )}
    </div>
  );
}
