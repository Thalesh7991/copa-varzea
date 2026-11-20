import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Crest from "@/components/Crest";
import CourtLines from "@/components/CourtLines";
import MatchCard from "@/components/MatchCard";
import { artilharia, classificacaoDoGrupo, config, getTime, grupoDoTime, jogosDoTime, times } from "@/lib/campeonato";
import { sinal } from "@/lib/format";

export const dynamicParams = false;

export function generateStaticParams() {
  return times.map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const t = getTime(id);
  return t ? { title: t.nome, description: `${t.nome} na ${config.nome} ${config.edicao}: jogos, resultados e artilheiros.` } : {};
}

export default async function TimePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const time = getTime(id);
  if (!time) notFound();

  const grupo = grupoDoTime(time.id);
  const tabela = grupo ? classificacaoDoGrupo(grupo) : [];
  const posicao = tabela.findIndex((l) => l.participante.chave === time.id);
  const linha = posicao >= 0 ? tabela[posicao] : null;
  const jogos = jogosDoTime(time.id);
  const goleadores = artilharia().filter((a) => a.time.id === time.id);

  const idx = times.findIndex((t) => t.id === time.id);
  const anterior = times[(idx - 1 + times.length) % times.length];
  const proximo = times[(idx + 1) % times.length];

  const stats = linha
    ? [
        { l: "Pontos", v: linha.pontos, gold: true },
        { l: "Jogos", v: linha.jogos },
        { l: "Vitórias", v: linha.vitorias },
        { l: "Empates", v: linha.empates },
        { l: "Derrotas", v: linha.derrotas },
        { l: "Saldo", v: sinal(linha.saldo) },
      ]
    : [];

  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[140px] md:left-1/4" style={{ background: `${time.cor}33` }} />
          <CourtLines className="absolute -right-20 top-1/2 h-[30rem] w-auto -translate-y-1/2 text-sky/[0.07]" />
        </div>
        <div className="container-x relative flex flex-col items-center gap-8 py-12 text-center md:flex-row md:text-left">
          <Crest time={time} size={220} glow className="animate-fade-up" />
          <div className="animate-fade-up [animation-delay:120ms]">
            <p className="eyebrow">{grupo ? `Grupo ${grupo}` : "Grupo a definir no sorteio"}</p>
            <h1 className="mt-2 font-display text-6xl leading-[0.9] tracking-wide sm:text-8xl">{time.nome}</h1>
            <div className="mt-4 flex flex-wrap justify-center gap-2 md:justify-start">
              <span className="chip" style={{ borderColor: `${time.cor}66`, color: time.cor }}>{time.sigla}</span>
              {linha && posicao >= 0 && linha.jogos > 0 && <span className="chip">{posicao + 1}º no grupo</span>}
              {jogos.length > 0 && <span className="chip">{jogos.length} jogos na tabela</span>}
            </div>
          </div>
        </div>
      </section>

      <div className="container-x py-10">
        {stats.length > 0 && (
          <div className="mb-12 grid grid-cols-3 gap-3 sm:grid-cols-6">
            {stats.map((s) => (
              <div key={s.l} className={`${s.gold ? "card-gold" : "card"} p-4 text-center`}>
                <p className={`font-display text-5xl leading-none tabular ${s.gold ? "text-gold" : ""}`}>{s.v}</p>
                <p className="mt-1 font-cond text-xs font-semibold uppercase tracking-[0.18em] text-muted">{s.l}</p>
              </div>
            ))}
          </div>
        )}

        <div className="grid gap-10 lg:grid-cols-[1fr_20rem]">
          <section>
            <h2 className="mb-5 font-display text-4xl tracking-wide">Jogos</h2>
            {jogos.length === 0 ? (
              <div className="card p-8 text-center text-muted">
                Os jogos do {time.nome} serão conhecidos após o sorteio dos grupos.
                <div className="mt-6"><Link href="/jogos" className="btn btn-ghost">Ver a tabela completa</Link></div>
              </div>
            ) : (
              <div className="grid gap-4">
                {jogos.map((j) => <MatchCard key={j.id} jogo={j} />)}
              </div>
            )}
          </section>

          <aside className="space-y-6">
            <div className="card p-5">
              <h2 className="font-display text-3xl tracking-wide">Artilheiros</h2>
              {goleadores.length === 0 ? (
                <p className="mt-3 text-sm text-muted">Nenhum gol registrado ainda.</p>
              ) : (
                <ol className="mt-3 divide-y divide-line">
                  {goleadores.map((a) => (
                    <li key={a.jogador} className="flex items-center justify-between py-2.5">
                      <span className="truncate font-semibold">{a.jogador}</span>
                      <span className="font-display text-2xl">{a.gols}</span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
            {grupo && (
              <div className="card p-5">
                <h2 className="font-display text-3xl tracking-wide">Grupo <span className="text-gold">{grupo}</span></h2>
                <ol className="mt-3 divide-y divide-line">
                  {tabela.map((l, i) => (
                    <li key={l.participante.chave} className={`flex items-center gap-3 py-2.5 ${l.participante.chave === time.id ? "text-gold" : ""}`}>
                      <span className="w-4 font-display text-lg text-dim">{i + 1}</span>
                      <Crest participante={l.participante} size={28} />
                      <span className="flex-1 truncate font-cond font-bold uppercase tracking-wide">{l.participante.rotulo}</span>
                      <span className="font-display text-xl">{l.pontos}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </aside>
        </div>

        <nav className="mt-14 grid grid-cols-2 gap-3" aria-label="Outras equipes">
          <Link href={`/times/${anterior.id}`} className="card group flex items-center gap-3 p-4 hover:border-line-strong">
            <span className="text-muted transition-transform group-hover:-translate-x-1">←</span>
            <Crest time={anterior} size={40} />
            <span className="truncate font-cond font-bold uppercase tracking-wide">{anterior.nome}</span>
          </Link>
          <Link href={`/times/${proximo.id}`} className="card group flex items-center justify-end gap-3 p-4 text-right hover:border-line-strong">
            <span className="truncate font-cond font-bold uppercase tracking-wide">{proximo.nome}</span>
            <Crest time={proximo} size={40} />
            <span className="text-muted transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </nav>
      </div>
    </>
  );
}
