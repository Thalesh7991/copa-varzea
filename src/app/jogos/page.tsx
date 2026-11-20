import type { Metadata } from "next";
import JogosLista from "@/components/JogosLista";
import PageHeader from "@/components/PageHeader";
import { config, estatisticas, jogos, sorteio, times } from "@/lib/campeonato";

export const metadata: Metadata = { title: "Jogos e resultados" };

export default function JogosPage() {
  const est = estatisticas();
  return (
    <>
      <PageHeader
        eyebrow="Tabela"
        titulo={<>Jogos e <span className="text-gold">resultados</span></>}
        descricao={
          <>
            Todos os {jogos.length} jogos da {config.nome}, de 5 de janeiro à grande final em 12 de fevereiro. Jogos às 19h30 e 20h30.
            {!sorteio.realizado && " As equipes aparecem como “Equipe 1, 2, 3…” até o sorteio."}
          </>
        }
      >
        <div className="flex flex-wrap gap-2">
          <span className="chip">{est.realizados} de {est.totalJogos} jogos disputados</span>
          {est.realizados > 0 && <span className="chip">{est.gols} gols · média {est.media.toFixed(1).replace(".", ",")}</span>}
          {config.local && <span className="chip">{config.local}</span>}
        </div>
      </PageHeader>
      <div className="container-x py-10">
        <JogosLista jogos={jogos} times={times} />
      </div>
    </>
  );
}
