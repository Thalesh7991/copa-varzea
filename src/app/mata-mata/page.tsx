import type { Metadata } from "next";
import Bracket from "@/components/Bracket";
import PageHeader from "@/components/PageHeader";
import { getJogo } from "@/lib/campeonato";
import type { JogoResolvido } from "@/lib/types";

export const metadata: Metadata = { title: "Mata-mata" };

export default function MataMataPage() {
  const j = (id: string) => getJogo(id) as JogoResolvido;
  const final = j("F");
  const campeao = final.vencedor ? (final.vencedor === "casa" ? final.mandante : final.visitante) : null;

  return (
    <>
      <PageHeader
        eyebrow="Fase final"
        titulo={<>Mata-<span className="text-gold">mata</span></>}
        descricao="Oito equipes, três rodadas, nenhuma segunda chance. O chaveamento é preenchido automaticamente conforme os grupos e os jogos terminam."
      />
      <div className="container-x py-10">
        <Bracket
          quartas={{ Q1: j("Q1"), Q2: j("Q2"), Q3: j("Q3"), Q4: j("Q4") }}
          semis={{ S1: j("S1"), S2: j("S2") }}
          final={final}
          campeao={campeao}
        />
        <div className="mt-12 grid gap-4 text-sm text-muted sm:grid-cols-3">
          <div className="card p-5">
            <p className="eyebrow mb-2">Quartas</p>
            1º do Grupo A x 2º do B · 1º do B x 2º do A · 1º do C x 2º do D · 1º do D x 2º do C.
          </div>
          <div className="card p-5">
            <p className="eyebrow mb-2">Semifinais</p>
            Vencedor das Quartas 1 x Vencedor das Quartas 4 · Vencedor das Quartas 3 x Vencedor das Quartas 2.
          </div>
          <div className="card-gold p-5">
            <p className="eyebrow mb-2">Final</p>
            Os vencedores das semifinais decidem o título em jogo único.
          </div>
        </div>
      </div>
    </>
  );
}
