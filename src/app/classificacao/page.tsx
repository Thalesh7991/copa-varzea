import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import StandingsTable from "@/components/StandingsTable";
import { classificacaoDoGrupo, config, grupoEncerrado, grupos, sorteio } from "@/lib/campeonato";

export const metadata: Metadata = { title: "Classificação" };

export default function ClassificacaoPage() {
  return (
    <>
      <PageHeader
        eyebrow="Fase de grupos"
        titulo={<>Classifi<span className="text-gold">cação</span></>}
        descricao={
          <>
            Quatro grupos de três equipes, em turno e returno. Os {config.classificadosPorGrupo} primeiros de cada grupo
            avançam para as quartas de final.
            {!sorteio.realizado && " Os grupos serão preenchidos após o sorteio."}
          </>
        }
      />
      <div className="container-x py-10">
        <div className="grid gap-5 lg:grid-cols-2">
          {grupos.map((g) => (
            <StandingsTable
              key={g}
              grupo={g}
              linhas={classificacaoDoGrupo(g)}
              classificados={config.classificadosPorGrupo}
              encerrado={grupoEncerrado(g)}
            />
          ))}
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-[1fr_1.2fr]">
          <div className="card p-6">
            <p className="eyebrow">Legenda</p>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              <li className="flex items-center gap-3">
                <span className="h-5 w-1 rounded bg-gradient-to-b from-gold-light to-gold-deep" />
                Classificado para as quartas de final
              </li>
              <li className="flex flex-wrap gap-x-5 gap-y-2">
                <span><b className="text-text">P</b> pontos</span>
                <span><b className="text-text">J</b> jogos</span>
                <span><b className="text-text">V/E/D</b> vitórias, empates, derrotas</span>
                <span><b className="text-text">GP/GC</b> gols pró e contra</span>
                <span><b className="text-text">SG</b> saldo</span>
              </li>
              <li>Vitória: {config.pontuacao.vitoria} pontos · Empate: {config.pontuacao.empate} ponto</li>
            </ul>
          </div>
          <div className="card p-6">
            <p className="eyebrow">Critérios de desempate</p>
            <ol className="mt-4 grid gap-2 sm:grid-cols-2">
              {config.criteriosDesempate.map((c, i) => (
                <li key={c} className="flex items-center gap-3 text-sm">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-line-strong font-display text-base text-sky">{i + 1}</span>
                  {c}
                </li>
              ))}
            </ol>
          </div>
        </div>

        <p className="mt-8 text-center">
          <Link href="/mata-mata" className="btn btn-ghost">Ver o mata-mata →</Link>
        </p>
      </div>
    </>
  );
}
