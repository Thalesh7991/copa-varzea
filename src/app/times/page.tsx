import type { Metadata } from "next";
import Link from "next/link";
import Crest from "@/components/Crest";
import PageHeader from "@/components/PageHeader";
import { grupoDoTime, times } from "@/lib/campeonato";

export const metadata: Metadata = { title: "Equipes" };

export default function TimesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Participantes"
        titulo={<>As <span className="text-gold">12</span> equipes</>}
        descricao="Conheça os clubes que vão disputar a Copa Várzea 2027."
      />
      <div className="container-x py-10">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
          {times.map((t) => {
            const grupo = grupoDoTime(t.id);
            return (
              <Link
                key={t.id}
                href={`/times/${t.id}`}
                className="card reveal group relative flex flex-col items-center overflow-hidden px-3 pb-6 pt-8 text-center transition-all duration-300 hover:-translate-y-1 hover:border-line-strong"
              >
                <span
                  className="pointer-events-none absolute inset-0 opacity-40 transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: `radial-gradient(70% 55% at 50% 30%, ${t.cor}30, transparent 70%)` }}
                />
                <span className="absolute inset-x-0 top-0 h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${t.cor}, transparent)` }} />
                <Crest time={t} size={128} className="relative transition-transform duration-500 group-hover:scale-110" />
                <span className="relative mt-4 font-display text-2xl leading-none tracking-wide sm:text-3xl">{t.nome}</span>
                <span className="relative mt-2 chip">{grupo ? `Grupo ${grupo}` : "Grupo a sortear"}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
