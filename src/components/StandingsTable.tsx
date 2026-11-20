import Link from "next/link";
import Crest from "./Crest";
import { sinal } from "@/lib/format";
import type { LinhaClassificacao } from "@/lib/types";

const COR_FORMA = { V: "bg-win", E: "bg-draw", D: "bg-loss" } as const;

export default function StandingsTable({
  grupo,
  linhas,
  classificados,
  encerrado,
}: {
  grupo: string;
  linhas: LinhaClassificacao[];
  classificados: number;
  encerrado: boolean;
}) {
  return (
    <div className="card reveal overflow-hidden">
      <div className="flex items-center justify-between border-b border-line px-4 py-4 sm:px-5">
        <h2 className="font-display text-4xl leading-none tracking-wide">
          Grupo <span className="text-gold">{grupo}</span>
        </h2>
        <span className={`chip ${encerrado ? "border-win/40 text-win" : ""}`}>{encerrado ? "Encerrado" : "Em disputa"}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[30rem] text-sm tabular">
          <thead>
            <tr className="font-cond text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-dim">
              <th className="w-10 py-3 pl-4 text-left sm:pl-5">#</th>
              <th className="py-3 text-left">Equipe</th>
              <th className="px-2 py-3 text-center text-gold" title="Pontos">P</th>
              <th className="px-2 py-3 text-center" title="Jogos">J</th>
              <th className="px-2 py-3 text-center" title="Vitórias">V</th>
              <th className="px-2 py-3 text-center" title="Empates">E</th>
              <th className="px-2 py-3 text-center" title="Derrotas">D</th>
              <th className="hidden px-2 py-3 text-center sm:table-cell" title="Gols pró">GP</th>
              <th className="hidden px-2 py-3 text-center sm:table-cell" title="Gols contra">GC</th>
              <th className="px-2 py-3 text-center" title="Saldo de gols">SG</th>
              <th className="py-3 pl-2 pr-4 text-left sm:pr-5">Últimos</th>
            </tr>
          </thead>
          <tbody>
            {linhas.map((l, i) => {
              const classifica = i < classificados;
              const p = l.participante;
              return (
                <tr key={p.chave} className="border-t border-line">
                  <td className="relative py-3 pl-4 sm:pl-5">
                    {classifica && <span className="absolute inset-y-2 left-0 w-1 rounded-r bg-gradient-to-b from-gold-light to-gold-deep" />}
                    <span className={`font-display text-xl ${classifica ? "text-gold" : "text-dim"}`}>{i + 1}</span>
                  </td>
                  <td className="py-3">
                    {p.time ? (
                      <Link href={`/times/${p.time.id}`} className="flex items-center gap-3 hover:text-gold">
                        <Crest time={p.time} size={34} />
                        <span className="truncate font-cond text-base font-bold uppercase tracking-wide">{p.rotulo}</span>
                      </Link>
                    ) : (
                      <span className="flex items-center gap-3 text-dim">
                        <Crest participante={p} size={34} />
                        <span className="truncate font-cond text-base font-bold uppercase tracking-wide">{p.rotulo}</span>
                      </span>
                    )}
                  </td>
                  <td className="px-2 py-3 text-center font-display text-2xl text-text">{l.pontos}</td>
                  <td className="px-2 py-3 text-center text-muted">{l.jogos}</td>
                  <td className="px-2 py-3 text-center text-muted">{l.vitorias}</td>
                  <td className="px-2 py-3 text-center text-muted">{l.empates}</td>
                  <td className="px-2 py-3 text-center text-muted">{l.derrotas}</td>
                  <td className="hidden px-2 py-3 text-center text-muted sm:table-cell">{l.golsPro}</td>
                  <td className="hidden px-2 py-3 text-center text-muted sm:table-cell">{l.golsContra}</td>
                  <td className={`px-2 py-3 text-center font-semibold ${l.saldo > 0 ? "text-win" : l.saldo < 0 ? "text-loss" : "text-muted"}`}>
                    {sinal(l.saldo)}
                  </td>
                  <td className="py-3 pl-2 pr-4 sm:pr-5">
                    <span className="flex gap-1">
                      {l.forma.length === 0 && <span className="text-dim">—</span>}
                      {l.forma.slice(-4).map((r, k) => (
                        <span key={k} title={r === "V" ? "Vitória" : r === "E" ? "Empate" : "Derrota"} className={`grid h-5 w-5 place-items-center rounded-full font-cond text-[0.6rem] font-bold text-ink ${COR_FORMA[r]}`}>
                          {r}
                        </span>
                      ))}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
