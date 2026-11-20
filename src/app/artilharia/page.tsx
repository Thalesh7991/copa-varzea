import type { Metadata } from "next";
import Link from "next/link";
import Crest from "@/components/Crest";
import PageHeader from "@/components/PageHeader";
import { artilharia, estatisticas } from "@/lib/campeonato";

export const metadata: Metadata = { title: "Artilharia" };

export default function ArtilhariaPage() {
  const lista = artilharia();
  const est = estatisticas();
  const podio = lista.slice(0, 3);
  // ordem visual do pódio: 2º, 1º, 3º
  const ordemPodio = [podio[1], podio[0], podio[2]].filter(Boolean);

  // posição com empate (ex.: 1, 2, 2, 4)
  const posicoes = lista.map((a, i) => lista.findIndex((b) => b.gols === a.gols) + 1 || i + 1);

  return (
    <>
      <PageHeader
        eyebrow="Goleadores"
        titulo={<>Artil<span className="text-gold">haria</span></>}
        descricao="Quem balança as redes na Copa Várzea. Atualizada a cada rodada com base nas súmulas."
      >
        {est.realizados > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="chip">{est.gols} gols marcados</span>
            <span className="chip">média de {est.media.toFixed(1).replace(".", ",")} por jogo</span>
          </div>
        )}
      </PageHeader>

      <div className="container-x py-10">
        {lista.length === 0 ? (
          <div className="card relative overflow-hidden px-6 py-16 text-center">
            <div className="pointer-events-none absolute left-1/2 top-0 h-60 w-[40rem] -translate-x-1/2 rounded-full bg-royal/20 blur-[100px]" />
            <p className="relative font-display text-5xl tracking-wide">A corrida pela <span className="text-gold">artilharia</span></p>
            <p className="relative mx-auto mt-3 max-w-md text-muted">
              começa no dia 5 de janeiro. Os goleadores aparecem aqui a partir da primeira rodada.
            </p>
            <Link href="/jogos" className="btn btn-ghost relative mt-8">Ver a tabela de jogos</Link>
          </div>
        ) : (
          <>
            <div className="mb-10 grid grid-cols-3 items-end gap-2 sm:gap-4">
              {ordemPodio.map((a) => {
                const pos = lista.indexOf(a) + 1;
                const lider = pos === 1;
                return (
                  <div key={`${a.time.id}-${a.jogador}`} className={`${lider ? "card-gold" : "card"} reveal flex flex-col items-center px-2 text-center ${lider ? "pb-8 pt-6" : "pb-6 pt-5"}`}>
                    <span className={`font-display leading-none ${lider ? "text-6xl text-gold" : "text-4xl text-dim"}`}>{pos}º</span>
                    <Crest time={a.time} size={lider ? 84 : 60} glow={lider} className="mt-3" />
                    <p className="mt-3 line-clamp-2 font-cond text-sm font-bold uppercase tracking-wide sm:text-lg">{a.jogador}</p>
                    <p className="truncate text-xs text-muted">{a.time.nome}</p>
                    <p className={`mt-2 font-display leading-none ${lider ? "text-6xl" : "text-5xl"}`}>{a.gols}</p>
                    <p className="font-cond text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted">gols</p>
                  </div>
                );
              })}
            </div>

            <div className="card overflow-hidden">
              <table className="w-full text-sm tabular">
                <thead>
                  <tr className="font-cond text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-dim">
                    <th className="w-12 py-3 pl-4 text-left sm:pl-5">#</th>
                    <th className="py-3 text-left">Jogador</th>
                    <th className="hidden py-3 text-center sm:table-cell">Jogos</th>
                    <th className="py-3 pl-2 pr-4 text-right text-gold sm:pr-5">Gols</th>
                  </tr>
                </thead>
                <tbody>
                  {lista.map((a, i) => (
                    <tr key={`${a.time.id}-${a.jogador}`} className="border-t border-line">
                      <td className={`py-3 pl-4 font-display text-xl sm:pl-5 ${posicoes[i] === 1 ? "text-gold" : "text-dim"}`}>{posicoes[i]}</td>
                      <td className="py-3">
                        <Link href={`/times/${a.time.id}`} className="flex items-center gap-3 hover:text-gold">
                          <Crest time={a.time} size={32} />
                          <span className="min-w-0">
                            <span className="block truncate font-semibold">{a.jogador}</span>
                            <span className="block truncate text-xs text-muted">{a.time.nome}</span>
                          </span>
                        </Link>
                      </td>
                      <td className="hidden py-3 text-center text-muted sm:table-cell">{a.jogos}</td>
                      <td className="py-3 pl-2 pr-4 text-right font-display text-2xl sm:pr-5">{a.gols}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </>
  );
}
