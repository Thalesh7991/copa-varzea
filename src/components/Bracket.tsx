import Link from "next/link";
import Crest from "./Crest";
import { dataCurta, hora } from "@/lib/format";
import { asset } from "@/lib/asset";
import type { JogoResolvido, Lado, Participante } from "@/lib/types";

function Linha({ p, gols, pen, venceu, perdeu }: { p: Participante; gols: number | null; pen?: number | null; venceu: boolean; perdeu: boolean }) {
  const nome = (
    <span className={`min-w-0 flex-1 truncate font-cond text-sm font-bold uppercase tracking-wide ${p.time ? (perdeu ? "text-muted" : "") : "text-dim"}`}>
      {p.rotulo}
    </span>
  );
  return (
    <div className={`flex items-center gap-2.5 px-3 py-2 ${venceu ? "bg-gold/[0.07]" : ""}`}>
      <Crest participante={p} size={28} />
      {p.time ? <Link href={`/times/${p.time.id}`} className="flex min-w-0 flex-1 hover:text-gold">{nome}</Link> : nome}
      {gols !== null && (
        <span className={`font-display text-xl tabular ${venceu ? "text-gold" : perdeu ? "text-muted" : ""}`}>
          {gols}
          {pen != null && <sup className="ml-0.5 font-cond text-[0.6rem] text-muted">({pen})</sup>}
        </span>
      )}
    </div>
  );
}

export function BracketMatch({ jogo, destaque = false }: { jogo: JogoResolvido; destaque?: boolean }) {
  const feito = jogo.status === "realizado";
  const res = (lado: Lado) => ({ venceu: jogo.vencedor === lado, perdeu: jogo.vencedor !== null && jogo.vencedor !== lado });
  return (
    <div className={`${destaque ? "card-gold" : "card"} w-full overflow-hidden !rounded-xl`}>
      <div className="flex items-center justify-between gap-2 border-b border-line px-3 py-1.5 font-cond text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted">
        <span className={destaque ? "text-gold" : ""}>{jogo.rotulo}</span>
        <span className="whitespace-nowrap">{dataCurta(jogo.data)} · {hora(jogo.hora)}</span>
      </div>
      <Linha p={jogo.mandante} gols={feito ? jogo.golsCasa : null} pen={jogo.penaltisCasa} {...res("casa")} />
      <div className="h-px bg-line" />
      <Linha p={jogo.visitante} gols={feito ? jogo.golsFora : null} pen={jogo.penaltisFora} {...res("fora")} />
    </div>
  );
}

/** Linhas que ligam os dois jogos das quartas à semifinal. */
function Conectores({ espelhado = false }: { espelhado?: boolean }) {
  return (
    <div className="relative" aria-hidden>
      <div className={`absolute bottom-1/4 top-1/4 w-px bg-gradient-to-b from-sky/40 via-gold/60 to-sky/40 ${espelhado ? "left-0" : "right-0"}`} />
      <div className="absolute top-1/4 h-px w-full bg-sky/40" />
      <div className="absolute bottom-1/4 h-px w-full bg-sky/40" />
      <div className={`absolute top-1/2 h-px w-3 bg-gold/60 ${espelhado ? "right-full" : "left-full"}`} />
    </div>
  );
}

function Campeao({ campeao }: { campeao: Participante | null }) {
  return (
    <div className="text-center">
      <p className="eyebrow">Campeão</p>
      {campeao?.time ? (
        <Link href={`/times/${campeao.time.id}`} className="mt-2 flex flex-col items-center gap-2">
          <Crest time={campeao.time} size={72} glow />
          <span className="font-display text-3xl text-gold">{campeao.time.nome}</span>
        </Link>
      ) : (
        <p className="mt-1 font-display text-3xl text-dim">A definir</p>
      )}
    </div>
  );
}

interface Props {
  quartas: Record<string, JogoResolvido>;
  semis: Record<string, JogoResolvido>;
  final: JogoResolvido;
  campeao: Participante | null;
}

/** Chaveamento espelhado no desktop (quartas → semi → FINAL ← semi ← quartas) e em lista no celular. */
export default function Bracket({ quartas, semis, final, campeao }: Props) {
  const coluna = "flex flex-col justify-around gap-6";
  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:block">
        <div className="mb-4 grid grid-cols-[1fr_1rem_1fr_1.15fr_1fr_1rem_1fr] gap-x-3 text-center font-cond text-xs font-semibold uppercase tracking-[0.22em] text-dim">
          <span>Quartas</span><span /><span>Semifinal</span><span className="text-gold">Final</span><span>Semifinal</span><span /><span>Quartas</span>
        </div>
        <div className="grid min-h-[30rem] grid-cols-[1fr_1rem_1fr_1.15fr_1fr_1rem_1fr] items-stretch gap-x-3">
          <div className={coluna}>
            <BracketMatch jogo={quartas.Q1} />
            <BracketMatch jogo={quartas.Q4} />
          </div>
          <Conectores />
          <div className={coluna}><BracketMatch jogo={semis.S1} /></div>

          <div className="flex flex-col items-center justify-center gap-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset("/images/logo-copa-varzea.webp")} alt="" className="w-40 animate-float drop-shadow-[0_0_40px_rgba(244,197,66,0.35)]" />
            <BracketMatch jogo={final} destaque />
            <Campeao campeao={campeao} />
          </div>

          <div className={coluna}><BracketMatch jogo={semis.S2} /></div>
          <Conectores espelhado />
          <div className={coluna}>
            <BracketMatch jogo={quartas.Q3} />
            <BracketMatch jogo={quartas.Q2} />
          </div>
        </div>
      </div>

      {/* Celular / tablet */}
      <div className="space-y-10 lg:hidden">
        {[
          { titulo: "Quartas de final", jogos: [quartas.Q1, quartas.Q2, quartas.Q3, quartas.Q4] },
          { titulo: "Semifinal", jogos: [semis.S1, semis.S2] },
        ].map((r) => (
          <section key={r.titulo}>
            <h2 className="mb-4 flex items-center gap-3 font-display text-3xl tracking-wide">
              {r.titulo}
              <span className="h-px flex-1 bg-line" />
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {r.jogos.map((j) => <BracketMatch key={j.id} jogo={j} />)}
            </div>
          </section>
        ))}
        <section className="card-gold relative overflow-hidden p-5 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("/images/logo-copa-varzea.webp")} alt="" className="mx-auto mb-4 w-32 drop-shadow-[0_0_40px_rgba(244,197,66,0.35)]" />
          <h2 className="mb-4 font-display text-4xl tracking-wide text-gold">Grande final</h2>
          <div className="mx-auto max-w-sm text-left"><BracketMatch jogo={final} destaque /></div>
          <div className="mt-6"><Campeao campeao={campeao} /></div>
        </section>
      </div>
    </>
  );
}
