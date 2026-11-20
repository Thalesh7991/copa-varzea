import Link from "next/link";
import Crest from "./Crest";
import { dataCurta, hora, NOME_FASE } from "@/lib/format";
import type { JogoResolvido, Lado, Participante } from "@/lib/types";

function rotuloJogo(j: JogoResolvido) {
  if (j.fase === "grupos") return `Grupo ${j.grupo} · ${j.turno === 2 ? "Returno" : "Turno"}`;
  return j.rotulo ?? NOME_FASE[j.fase];
}

function LadoJogo({ p, lado, vencedor, realizado }: { p: Participante; lado: Lado; vencedor: Lado | null; realizado: boolean }) {
  const perdeu = realizado && vencedor !== null && vencedor !== lado;
  const conteudo = (
    <>
      <Crest participante={p} size={54} />
      <span
        className={`line-clamp-2 font-cond text-sm font-bold uppercase leading-tight tracking-wide sm:text-base ${
          p.time ? (perdeu ? "text-muted" : "text-text") : "text-dim"
        }`}
      >
        {p.rotulo}
      </span>
    </>
  );
  const base = `flex min-w-0 flex-col items-center gap-2 text-center sm:flex-row sm:gap-3 ${
    lado === "casa" ? "sm:flex-row-reverse sm:text-right" : "sm:text-left"
  }`;
  return p.time ? (
    <Link href={`/times/${p.time.id}`} className={`${base} transition-opacity hover:opacity-80`}>
      {conteudo}
    </Link>
  ) : (
    <div className={base}>{conteudo}</div>
  );
}

export default function MatchCard({ jogo, mostrarData = true }: { jogo: JogoResolvido; mostrarData?: boolean }) {
  const realizado = jogo.status === "realizado" && jogo.golsCasa !== null && jogo.golsFora !== null;
  const final = jogo.fase === "final";
  const temPenaltis = realizado && jogo.penaltisCasa != null && jogo.penaltisFora != null;

  return (
    <article className={`${final ? "card-gold" : "card"} group overflow-hidden p-4 transition-transform duration-300 hover:-translate-y-0.5 sm:p-5`}>
      <header className="mb-4 flex items-center justify-between gap-2">
        <span className={`chip ${final ? "border-gold/40 text-gold" : ""}`}>{rotuloJogo(jogo)}</span>
        <span className="font-cond text-xs font-semibold uppercase tracking-[0.16em] text-muted">
          {mostrarData && <>{dataCurta(jogo.data)} · </>}
          {hora(jogo.hora)}
        </span>
      </header>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-4">
        <LadoJogo p={jogo.mandante} lado="casa" vencedor={jogo.vencedor} realizado={realizado} />

        <div className="flex min-w-[5.5rem] flex-col items-center">
          {realizado ? (
            <>
              <div className="flex items-center gap-2 font-display text-5xl leading-none tabular sm:text-6xl">
                <span className={jogo.vencedor === "fora" ? "text-muted" : "text-text"}>{jogo.golsCasa}</span>
                <span className="text-2xl text-dim">–</span>
                <span className={jogo.vencedor === "casa" ? "text-muted" : "text-text"}>{jogo.golsFora}</span>
              </div>
              {temPenaltis && (
                <span className="mt-1 font-cond text-xs font-semibold uppercase tracking-wider text-gold">
                  Pên. {jogo.penaltisCasa} – {jogo.penaltisFora}
                </span>
              )}
              <span className="mt-1 font-cond text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-win">Encerrado</span>
            </>
          ) : jogo.status === "adiado" ? (
            <span className="chip border-loss/40 text-loss">Adiado</span>
          ) : (
            <>
              <span className="font-display text-3xl leading-none text-dim">VS</span>
              <span className="mt-1.5 font-cond text-sm font-bold tracking-wider text-sky">{hora(jogo.hora)}</span>
            </>
          )}
        </div>

        <LadoJogo p={jogo.visitante} lado="fora" vencedor={jogo.vencedor} realizado={realizado} />
      </div>

      {jogo.obs && <p className="mt-4 border-t border-line pt-3 text-center text-xs text-muted">{jogo.obs}</p>}
    </article>
  );
}
