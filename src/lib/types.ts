export type Fase = "grupos" | "quartas" | "semi" | "final";
export type Status = "agendado" | "realizado" | "adiado";
export type Lado = "casa" | "fora";

export interface Time {
  id: string;
  nome: string;
  sigla: string;
  escudo: string;
  /** Cor de destaque do clube (hex), usada em brilhos e detalhes. */
  cor: string;
}

export interface FaseInfo {
  id: Fase;
  nome: string;
  periodo: string;
  descricao: string;
}

export interface Config {
  nome: string;
  edicao: number;
  modalidade: string;
  organizador: string;
  cidade: string;
  estado: string;
  local: string | null;
  inicio: string;
  grupos: Record<string, number[]>;
  classificadosPorGrupo: number;
  pontuacao: { vitoria: number; empate: number; derrota: number };
  criteriosDesempate: string[];
  fases: FaseInfo[];
}

export interface Sorteio {
  realizado: boolean;
  data: string | null;
  /** Número da equipe na tabela ("1".."12") -> id do time. */
  equipes: Record<string, string | null>;
}

export interface Gol {
  lado: Lado;
  jogador: string;
  qtd?: number;
}

export interface Jogo {
  id: string;
  fase: Fase;
  turno?: 1 | 2;
  grupo?: string;
  rotulo?: string;
  data: string;
  hora: string;
  local?: string;
  /**
   * Referência do mandante/visitante:
   * "E1".."E12" (equipe do sorteio), "1A"/"2B" (posição no grupo),
   * "VQ1" (vencedor das quartas 1), "VS1" (vencedor da semi 1) ou o id de um time.
   */
  casa: string;
  fora: string;
  golsCasa: number | null;
  golsFora: number | null;
  penaltisCasa?: number | null;
  penaltisFora?: number | null;
  status: Status;
  gols?: Gol[];
  obs?: string;
}

/** Um lado do confronto já resolvido (time definido ou vaga ainda em aberto). */
export interface Participante {
  /** id do time quando definido; senão a própria referência (ex.: "E1", "1A"). */
  chave: string;
  time: Time | null;
  /** Texto exibido quando o time ainda não está definido. */
  rotulo: string;
}

export interface JogoResolvido extends Jogo {
  mandante: Participante;
  visitante: Participante;
  vencedor: Lado | null;
}

export interface LinhaClassificacao {
  participante: Participante;
  pontos: number;
  jogos: number;
  vitorias: number;
  empates: number;
  derrotas: number;
  golsPro: number;
  golsContra: number;
  saldo: number;
  forma: ("V" | "E" | "D")[];
}

export interface Artilheiro {
  jogador: string;
  time: Time;
  gols: number;
  jogos: number;
}
