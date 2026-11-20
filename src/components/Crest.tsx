import { asset } from "@/lib/asset";
import type { Participante, Time } from "@/lib/types";

interface Props {
  time?: Time | null;
  participante?: Participante;
  size?: number;
  className?: string;
  glow?: boolean;
  eager?: boolean;
}

/** Escudo do time; quando a vaga ainda não está definida, mostra um escudo-silhueta. */
export default function Crest({ time, participante, size = 48, className = "", glow = false, eager = false }: Props) {
  const t = time ?? participante?.time ?? null;
  if (t) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={asset(t.escudo)}
        alt={`Escudo ${t.nome}`}
        width={size}
        height={size}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className={`shrink-0 object-contain ${className}`}
        style={{
          width: size,
          height: size,
          filter: glow ? `drop-shadow(0 0 ${Math.round(size / 5)}px ${t.cor}66)` : undefined,
        }}
      />
    );
  }
  const marca = participante?.chave.replace(/^E/, "") ?? "?";
  return (
    <span
      className={`relative inline-grid shrink-0 place-items-center ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <svg viewBox="0 0 48 56" className="absolute inset-0 h-full w-full" fill="none">
        <path
          d="M24 2 44 9v17c0 13-8.5 22.5-20 28C12.5 48.5 4 39 4 26V9l20-7Z"
          fill="url(#gCrest)"
          stroke="rgb(150 175 255 / 0.28)"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />
        <defs>
          <linearGradient id="gCrest" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1a2550" />
            <stop offset="1" stopColor="#0b1124" />
          </linearGradient>
        </defs>
      </svg>
      <span className="relative font-display leading-none text-sky/80" style={{ fontSize: Math.max(11, size * 0.36) }}>
        {marca.length <= 3 ? marca : "?"}
      </span>
    </span>
  );
}
