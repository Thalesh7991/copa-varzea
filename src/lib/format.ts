const DIAS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const DIAS_LONGOS = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const MESES_LONGOS = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

function partes(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const dia = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return { y, m, d, dia };
}

/** "Ter · 05 jan" */
export function dataCurta(iso: string) {
  const { m, d, dia } = partes(iso);
  return `${DIAS[dia]} · ${String(d).padStart(2, "0")} ${MESES[m - 1]}`;
}

/** "Terça-feira, 05 de janeiro" */
export function dataLonga(iso: string) {
  const { m, d, dia } = partes(iso);
  return `${DIAS_LONGOS[dia]}, ${String(d).padStart(2, "0")} de ${MESES_LONGOS[m - 1]}`;
}

export function diaMes(iso: string) {
  const { m, d } = partes(iso);
  return { dia: String(d).padStart(2, "0"), mes: MESES[m - 1], semana: DIAS[partes(iso).dia] };
}

/** "19:30" -> "19h30" */
export const hora = (h: string) => h.replace(":", "h");

export const sinal = (n: number) => (n > 0 ? `+${n}` : String(n));

export const NOME_FASE: Record<string, string> = {
  grupos: "Fase de grupos",
  quartas: "Quartas de final",
  semi: "Semifinal",
  final: "Final",
};
