"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { asset } from "@/lib/asset";

const LINKS = [
  { href: "/", label: "Início" },
  { href: "/jogos", label: "Jogos" },
  { href: "/classificacao", label: "Classificação" },
  { href: "/mata-mata", label: "Mata-mata" },
  { href: "/artilharia", label: "Artilharia" },
  { href: "/times", label: "Times" },
];

function ativo(pathname: string, href: string) {
  const p = pathname.replace(/\/$/, "") || "/";
  return href === "/" ? p === "/" : p === href || p.startsWith(`${href}/`);
}

export default function SiteHeader() {
  const pathname = usePathname() ?? "/";
  const [aberto, setAberto] = useState(false);
  const [rolou, setRolou] = useState(false);

  useEffect(() => {
    const onScroll = () => setRolou(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = aberto ? "hidden" : "";
  }, [aberto]);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        rolou || aberto ? "bg-ink/85 backdrop-blur-xl border-b border-line" : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Link href="/" className="group flex items-center gap-3" onClick={() => setAberto(false)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("/images/logo-copa-varzea.webp")} alt="" width={40} height={40} className="h-10 w-10 drop-shadow-[0_0_12px_rgba(244,197,66,0.35)] transition-transform group-hover:scale-105" />
          <span className="leading-none">
            <span className="block font-display text-2xl tracking-wide">
              Copa <span className="text-gold">Várzea</span>
            </span>
            <span className="block font-cond text-[0.62rem] font-semibold uppercase tracking-[0.3em] text-muted">Futsal · Botucatu 2027</span>
          </span>
        </Link>

        <nav className="hidden lg:block" aria-label="Principal">
          <ul className="flex items-center gap-1">
            {LINKS.map((l) => {
              const on = ativo(pathname, l.href);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={on ? "page" : undefined}
                    className={`relative rounded-full px-4 py-2 font-cond text-sm font-semibold uppercase tracking-[0.14em] transition-colors ${
                      on ? "text-gold" : "text-muted hover:text-text"
                    }`}
                  >
                    {l.label}
                    {on && <span className="absolute inset-x-4 -bottom-0.5 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <button
          type="button"
          className="lg:hidden relative h-10 w-10 rounded-full border border-line-strong bg-white/[0.03]"
          aria-label={aberto ? "Fechar menu" : "Abrir menu"}
          aria-expanded={aberto}
          onClick={() => setAberto((v) => !v)}
        >
          <span className={`absolute left-1/2 top-1/2 h-0.5 w-4 -translate-x-1/2 bg-text transition-transform ${aberto ? "rotate-45" : "-translate-y-1.5"}`} />
          <span className={`absolute left-1/2 top-1/2 h-0.5 w-4 -translate-x-1/2 bg-text transition-opacity ${aberto ? "opacity-0" : ""}`} />
          <span className={`absolute left-1/2 top-1/2 h-0.5 w-4 -translate-x-1/2 bg-text transition-transform ${aberto ? "-rotate-45" : "translate-y-1.5"}`} />
        </button>
      </div>

      {aberto && (
        <nav className="lg:hidden fixed inset-x-0 top-16 bottom-0 bg-ink/97 backdrop-blur-xl" aria-label="Menu">
          <ul className="container-x flex flex-col pt-6">
            {LINKS.map((l, i) => {
              const on = ativo(pathname, l.href);
              return (
                <li key={l.href} className="animate-fade-up" style={{ animationDelay: `${i * 40}ms` }}>
                  <Link
                    href={l.href}
                    onClick={() => setAberto(false)}
                    className={`flex items-center justify-between border-b border-line py-4 font-display text-4xl tracking-wide ${on ? "text-gold" : "text-text"}`}
                  >
                    {l.label}
                    <span className="font-cond text-sm text-dim">0{i + 1}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}
