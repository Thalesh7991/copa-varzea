import Link from "next/link";
import { asset } from "@/lib/asset";
import { config } from "@/lib/campeonato";

export default function SiteFooter() {
  return (
    <footer className="relative mt-24 border-t border-line bg-night/60">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      <div className="container-x grid gap-10 py-12 sm:grid-cols-[1.4fr_1fr_1fr]">
        <div className="flex items-start gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("/images/logo-copa-varzea.webp")} alt="" width={64} height={64} className="h-16 w-16" />
          <div>
            <p className="font-display text-3xl leading-none tracking-wide">
              {config.nome} <span className="text-gold">{config.edicao}</span>
            </p>
            <p className="mt-2 max-w-xs text-sm text-muted">
              Campeonato de {config.modalidade.toLowerCase()} em {config.cidade}/{config.estado}. Uma realização{" "}
              <strong className="font-semibold text-text">{config.organizador}</strong>.
            </p>
          </div>
        </div>
        <div>
          <p className="eyebrow mb-3">Competição</p>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link className="hover:text-text" href="/jogos">Jogos e resultados</Link></li>
            <li><Link className="hover:text-text" href="/classificacao">Classificação</Link></li>
            <li><Link className="hover:text-text" href="/mata-mata">Mata-mata</Link></li>
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-3">Mais</p>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link className="hover:text-text" href="/artilharia">Artilharia</Link></li>
            <li><Link className="hover:text-text" href="/times">Equipes</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <p className="container-x py-5 font-cond text-xs uppercase tracking-[0.2em] text-dim">
          © {config.edicao} {config.organizador} · {config.cidade}/{config.estado}
        </p>
      </div>
    </footer>
  );
}
