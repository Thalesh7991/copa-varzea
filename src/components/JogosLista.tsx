"use client";

import { useMemo, useState } from "react";
import MatchCard from "./MatchCard";
import { dataLonga, diaMes } from "@/lib/format";
import type { Fase, JogoResolvido, Time } from "@/lib/types";

const FILTROS: { id: Fase | "todos"; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "grupos", label: "Fase de grupos" },
  { id: "quartas", label: "Quartas" },
  { id: "semi", label: "Semifinal" },
  { id: "final", label: "Final" },
];

export default function JogosLista({ jogos, times }: { jogos: JogoResolvido[]; times: Time[] }) {
  const [fase, setFase] = useState<Fase | "todos">("todos");
  const [time, setTime] = useState("");

  const porData = useMemo(() => {
    const filtrados = jogos.filter(
      (j) =>
        (fase === "todos" || j.fase === fase) &&
        (!time || j.mandante.chave === time || j.visitante.chave === time)
    );
    const mapa = new Map<string, JogoResolvido[]>();
    for (const j of filtrados) mapa.set(j.data, [...(mapa.get(j.data) ?? []), j]);
    return [...mapa.entries()];
  }, [jogos, fase, time]);

  return (
    <>
      <div className="sticky top-16 z-30 -mx-4 mb-8 border-b border-line bg-ink/85 px-4 py-3 backdrop-blur-xl sm:mx-0 sm:rounded-2xl sm:border sm:px-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1" role="tablist" aria-label="Filtrar por fase">
            {FILTROS.map((f) => (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={fase === f.id}
                onClick={() => setFase(f.id)}
                className={`shrink-0 rounded-full px-4 py-2 font-cond text-sm font-semibold uppercase tracking-[0.12em] transition-colors ${
                  fase === f.id ? "bg-gold text-ink" : "text-muted hover:bg-white/5 hover:text-text"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <label className="relative block md:w-64">
            <span className="sr-only">Filtrar por equipe</span>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full appearance-none rounded-full border border-line-strong bg-surface px-4 py-2 pr-10 font-cond text-sm font-semibold uppercase tracking-[0.1em] text-text outline-none focus:border-gold/60"
            >
              <option value="">Todas as equipes</option>
              {times.map((t) => (
                <option key={t.id} value={t.id}>{t.nome}</option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted">▼</span>
          </label>
        </div>
      </div>

      {porData.length === 0 ? (
        <div className="card p-10 text-center text-muted">
          Nenhum jogo encontrado para esse filtro.
          {time && " Os confrontos de cada equipe aparecem aqui após o sorteio."}
        </div>
      ) : (
        <div className="space-y-12">
          {porData.map(([data, lista]) => {
            const d = diaMes(data);
            return (
              <section key={data} className="grid gap-4 md:grid-cols-[7rem_1fr] md:gap-8">
                <header className="flex items-center gap-4 md:sticky md:top-40 md:block md:self-start">
                  <div className="flex items-baseline gap-2 md:block">
                    <p className="font-display text-6xl leading-none text-gold md:text-7xl">{d.dia}</p>
                    <p className="font-cond text-lg font-bold uppercase tracking-[0.2em]">{d.mes}</p>
                  </div>
                  <p className="font-cond text-sm font-semibold uppercase tracking-[0.2em] text-muted md:mt-1">{d.semana}</p>
                  <span className="h-px flex-1 bg-line md:hidden" />
                </header>
                <div>
                  <p className="sr-only">{dataLonga(data)}</p>
                  <div className="grid gap-4 lg:grid-cols-2">
                    {lista.map((j) => <MatchCard key={j.id} jogo={j} mostrarData={false} />)}
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      )}
    </>
  );
}
