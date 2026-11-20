"use client";

import { useEffect, useState } from "react";

interface Props {
  alvo: string;
  /** Texto exibido quando o horário já passou. */
  encerrado?: React.ReactNode;
  compacto?: boolean;
}

function restante(alvo: number) {
  const diff = Math.max(0, alvo - Date.now());
  return {
    diff,
    dias: Math.floor(diff / 86_400_000),
    horas: Math.floor((diff / 3_600_000) % 24),
    minutos: Math.floor((diff / 60_000) % 60),
    segundos: Math.floor((diff / 1000) % 60),
  };
}

export default function Countdown({ alvo, encerrado, compacto = false }: Props) {
  const alvoMs = new Date(alvo).getTime();
  const [t, setT] = useState<ReturnType<typeof restante> | null>(null);

  useEffect(() => {
    const tick = () => setT(restante(alvoMs));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [alvoMs]);

  if (t && t.diff === 0 && encerrado) return <>{encerrado}</>;

  const blocos: [string, number | undefined][] = [
    ["Dias", t?.dias],
    ["Horas", t?.horas],
    ["Min", t?.minutos],
    ["Seg", t?.segundos],
  ];

  return (
    <div className="flex gap-2 sm:gap-3" role="timer" aria-live="off">
      {blocos.map(([rotulo, valor], i) => (
        <div
          key={rotulo}
          className={`relative overflow-hidden rounded-xl border border-line-strong bg-gradient-to-b from-surface-2/90 to-night/90 text-center ${
            compacto ? "w-14 py-2" : "w-[4.25rem] py-3 sm:w-20"
          }`}
        >
          <span className="absolute inset-x-0 top-1/2 h-px bg-ink/70" />
          <span
            className={`relative block font-display leading-none tabular ${i === 0 ? "text-gold" : "text-text"} ${
              compacto ? "text-3xl" : "text-4xl sm:text-5xl"
            }`}
          >
            {valor === undefined ? "--" : String(valor).padStart(2, "0")}
          </span>
          <span className="relative mt-1 block font-cond text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-muted">{rotulo}</span>
        </div>
      ))}
    </div>
  );
}
