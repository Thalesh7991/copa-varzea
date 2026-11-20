import CourtLines from "./CourtLines";

interface Props {
  eyebrow: string;
  titulo: React.ReactNode;
  descricao?: React.ReactNode;
  children?: React.ReactNode;
}

/** Cabeçalho das páginas internas. */
export default function PageHeader({ eyebrow, titulo, descricao, children }: Props) {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[28rem] w-[60rem] -translate-x-1/2 rounded-full bg-royal/25 blur-[120px]" />
        <CourtLines className="absolute -right-24 top-1/2 h-[26rem] w-auto -translate-y-1/2 text-sky/[0.07] sm:right-0" />
      </div>
      <div className="container-x relative pb-10 pt-10 sm:pb-14 sm:pt-16">
        <p className="eyebrow animate-fade-up">{eyebrow}</p>
        <h1 className="mt-3 animate-fade-up font-display text-6xl leading-[0.9] tracking-wide [animation-delay:80ms] sm:text-8xl">
          {titulo}
        </h1>
        {descricao && (
          <p className="mt-4 max-w-2xl animate-fade-up text-base text-muted [animation-delay:160ms] sm:text-lg">{descricao}</p>
        )}
        {children && <div className="mt-6 animate-fade-up [animation-delay:240ms]">{children}</div>}
      </div>
    </section>
  );
}
