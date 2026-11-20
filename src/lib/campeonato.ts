import configJson from "../../data/config.json";
import timesJson from "../../data/times.json";
import sorteioJson from "../../data/sorteio.json";
import jogosJson from "../../data/jogos.json";
import type {
  Artilheiro,
  Config,
  Jogo,
  JogoResolvido,
  Lado,
  LinhaClassificacao,
  Participante,
  Sorteio,
  Time,
} from "./types";

export const config = configJson as Config;
export const times = timesJson as Time[];
export const sorteio = sorteioJson as Sorteio;
const jogosBrutos = jogosJson as Jogo[];

const timesPorId = new Map(times.map((t) => [t.id, t]));
export const getTime = (id: string) => timesPorId.get(id);
export const grupos = Object.keys(config.grupos);

/* ---------- Resolução das referências ---------- */

function vencedorDe(j: Pick<Jogo, "status" | "golsCasa" | "golsFora" | "penaltisCasa" | "penaltisFora">): Lado | null {
  if (j.status !== "realizado" || j.golsCasa === null || j.golsFora === null) return null;
  if (j.golsCasa > j.golsFora) return "casa";
  if (j.golsFora > j.golsCasa) return "fora";
  const pc = j.penaltisCasa ?? null;
  const pf = j.penaltisFora ?? null;
  if (pc !== null && pf !== null && pc !== pf) return pc > pf ? "casa" : "fora";
  return null;
}

function pendente(chave: string, rotulo: string): Participante {
  return { chave, time: null, rotulo };
}

function deTime(time: Time): Participante {
  return { chave: time.id, time, rotulo: time.nome };
}

function resolverEquipe(numero: string): Participante {
  const id = sorteio.equipes[numero];
  const time = id ? getTime(id) : undefined;
  return time ? deTime(time) : pendente(`E${numero}`, `Equipe ${numero}`);
}

/** Grupo de uma equipe do sorteio (1..12). */
export function grupoDaEquipe(numero: number): string | undefined {
  return grupos.find((g) => config.grupos[g].includes(numero));
}

/** Grupo em que um time caiu (após o sorteio). */
export function grupoDoTime(timeId: string): string | undefined {
  const numero = Object.entries(sorteio.equipes).find(([, id]) => id === timeId)?.[0];
  return numero ? grupoDaEquipe(Number(numero)) : undefined;
}

/* ---------- Fase de grupos ---------- */

const jogosGrupos: JogoResolvido[] = jogosBrutos
  .filter((j) => j.fase === "grupos")
  .map((j) => {
    const mandante = resolverRefSimples(j.casa);
    const visitante = resolverRefSimples(j.fora);
    return { ...j, mandante, visitante, vencedor: vencedorDe(j) };
  });

function resolverRefSimples(ref: string): Participante {
  const time = getTime(ref);
  if (time) return deTime(time);
  const m = /^E(\d+)$/.exec(ref);
  if (m) return resolverEquipe(m[1]);
  return pendente(ref, ref);
}

function linhaVazia(p: Participante): LinhaClassificacao {
  return { participante: p, pontos: 0, jogos: 0, vitorias: 0, empates: 0, derrotas: 0, golsPro: 0, golsContra: 0, saldo: 0, forma: [] };
}

function pontosConfronto(chave: string, jogos: JogoResolvido[]): number {
  let pts = 0;
  for (const j of jogos) {
    const ehCasa = j.mandante.chave === chave;
    if (j.vencedor === null) pts += config.pontuacao.empate;
    else if ((j.vencedor === "casa") === ehCasa) pts += config.pontuacao.vitoria;
  }
  return pts;
}

export function classificacaoDoGrupo(grupo: string): LinhaClassificacao[] {
  const participantes = config.grupos[grupo].map((n) => resolverEquipe(String(n)));
  const linhas = new Map(participantes.map((p) => [p.chave, linhaVazia(p)]));
  const ordemSorteio = new Map(participantes.map((p, i) => [p.chave, i]));

  const realizados = jogosGrupos
    .filter((j) => j.grupo === grupo && j.status === "realizado" && j.golsCasa !== null && j.golsFora !== null)
    .sort((a, b) => (a.data + a.hora).localeCompare(b.data + b.hora));

  for (const j of realizados) {
    const casa = linhas.get(j.mandante.chave);
    const fora = linhas.get(j.visitante.chave);
    if (!casa || !fora) continue;
    const gc = j.golsCasa as number;
    const gf = j.golsFora as number;
    casa.jogos++; fora.jogos++;
    casa.golsPro += gc; casa.golsContra += gf;
    fora.golsPro += gf; fora.golsContra += gc;
    if (gc > gf) {
      casa.vitorias++; fora.derrotas++;
      casa.pontos += config.pontuacao.vitoria; fora.pontos += config.pontuacao.derrota;
      casa.forma.push("V"); fora.forma.push("D");
    } else if (gf > gc) {
      fora.vitorias++; casa.derrotas++;
      fora.pontos += config.pontuacao.vitoria; casa.pontos += config.pontuacao.derrota;
      fora.forma.push("V"); casa.forma.push("D");
    } else {
      casa.empates++; fora.empates++;
      casa.pontos += config.pontuacao.empate; fora.pontos += config.pontuacao.empate;
      casa.forma.push("E"); fora.forma.push("E");
    }
  }
  for (const l of linhas.values()) l.saldo = l.golsPro - l.golsContra;

  return [...linhas.values()].sort((a, b) => {
    if (b.pontos !== a.pontos) return b.pontos - a.pontos;
    if (b.vitorias !== a.vitorias) return b.vitorias - a.vitorias;
    if (b.saldo !== a.saldo) return b.saldo - a.saldo;
    if (b.golsPro !== a.golsPro) return b.golsPro - a.golsPro;
    const ka = a.participante.chave;
    const kb = b.participante.chave;
    const diretos = realizados.filter(
      (j) => (j.mandante.chave === ka && j.visitante.chave === kb) || (j.mandante.chave === kb && j.visitante.chave === ka)
    );
    if (diretos.length) {
      const d = pontosConfronto(kb, diretos) - pontosConfronto(ka, diretos);
      if (d !== 0) return d;
    }
    return (ordemSorteio.get(ka) ?? 0) - (ordemSorteio.get(kb) ?? 0);
  });
}

export function grupoEncerrado(grupo: string): boolean {
  const doGrupo = jogosGrupos.filter((j) => j.grupo === grupo);
  return doGrupo.length > 0 && doGrupo.every((j) => j.status === "realizado");
}

const classificacoes = new Map(grupos.map((g) => [g, classificacaoDoGrupo(g)]));

/* ---------- Mata-mata ---------- */

const resolvidos = new Map<string, JogoResolvido>(jogosGrupos.map((j) => [j.id, j]));

function resolverRef(ref: string): Participante {
  const time = getTime(ref);
  if (time) return deTime(time);

  const eq = /^E(\d+)$/.exec(ref);
  if (eq) return resolverEquipe(eq[1]);

  const pos = /^(\d)([A-Z])$/.exec(ref);
  if (pos) {
    const [, n, g] = pos;
    const rotulo = `${n}º do Grupo ${g}`;
    if (!grupoEncerrado(g)) return pendente(ref, rotulo);
    const linha = classificacoes.get(g)?.[Number(n) - 1];
    return linha?.participante.time ? linha.participante : pendente(ref, rotulo);
  }

  const venc = /^V([QS])(\d)$/.exec(ref);
  if (venc) {
    const [, tipo, n] = venc;
    const id = `${tipo}${n}`;
    const rotulo = tipo === "Q" ? `Vencedor Quartas ${n}` : `Vencedor Semi ${n}`;
    const jogo = resolvidos.get(id);
    if (!jogo || !jogo.vencedor) return pendente(ref, rotulo);
    const p = jogo.vencedor === "casa" ? jogo.mandante : jogo.visitante;
    return p.time ? p : pendente(ref, rotulo);
  }

  return pendente(ref, ref);
}

for (const fase of ["quartas", "semi", "final"] as const) {
  for (const j of jogosBrutos.filter((x) => x.fase === fase)) {
    resolvidos.set(j.id, { ...j, mandante: resolverRef(j.casa), visitante: resolverRef(j.fora), vencedor: vencedorDe(j) });
  }
}

/** Todos os jogos, já com times resolvidos, em ordem cronológica. */
export const jogos: JogoResolvido[] = [...resolvidos.values()].sort((a, b) =>
  (a.data + a.hora).localeCompare(b.data + b.hora)
);

export const getJogo = (id: string) => resolvidos.get(id);

export function jogosDoTime(timeId: string): JogoResolvido[] {
  return jogos.filter((j) => j.mandante.chave === timeId || j.visitante.chave === timeId);
}

export const proximosJogos = (n = 4) => jogos.filter((j) => j.status !== "realizado").slice(0, n);
export const ultimosResultados = (n = 4) => jogos.filter((j) => j.status === "realizado").slice(-n).reverse();

export function campeao(): Time | null {
  const f = jogos.find((j) => j.fase === "final");
  if (!f?.vencedor) return null;
  return (f.vencedor === "casa" ? f.mandante : f.visitante).time;
}

/* ---------- Artilharia ---------- */

const normalizar = (s: string) => s.trim().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export function artilharia(): Artilheiro[] {
  const mapa = new Map<string, Artilheiro & { jogosSet: Set<string> }>();
  for (const j of jogos) {
    if (j.status !== "realizado" || !j.gols) continue;
    for (const g of j.gols) {
      const time = (g.lado === "casa" ? j.mandante : j.visitante).time;
      if (!time || !g.jogador?.trim()) continue;
      const chave = `${time.id}|${normalizar(g.jogador)}`;
      const atual = mapa.get(chave) ?? { jogador: g.jogador.trim(), time, gols: 0, jogos: 0, jogosSet: new Set<string>() };
      atual.gols += g.qtd ?? 1;
      atual.jogosSet.add(j.id);
      mapa.set(chave, atual);
    }
  }
  return [...mapa.values()]
    .map(({ jogosSet, ...a }) => ({ ...a, jogos: jogosSet.size }))
    .sort((a, b) => b.gols - a.gols || a.jogos - b.jogos || a.jogador.localeCompare(b.jogador));
}

/* ---------- Números gerais ---------- */

export function estatisticas() {
  const realizados = jogos.filter((j) => j.status === "realizado" && j.golsCasa !== null && j.golsFora !== null);
  const gols = realizados.reduce((s, j) => s + (j.golsCasa ?? 0) + (j.golsFora ?? 0), 0);
  return {
    totalJogos: jogos.length,
    realizados: realizados.length,
    gols,
    media: realizados.length ? gols / realizados.length : 0,
  };
}
