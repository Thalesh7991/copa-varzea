import Link from "next/link";
import Countdown from "@/components/Countdown";
import CourtLines from "@/components/CourtLines";
import Crest from "@/components/Crest";
import MatchCard from "@/components/MatchCard";
import SectionTitle from "@/components/SectionTitle";
import { asset } from "@/lib/asset";
import {
  artilharia,
  campeao,
  classificacaoDoGrupo,
  config,
  grupos,
  jogos,
  proximosJogos,
  sorteio,
  times,
  ultimosResultados,
} from "@/lib/campeonato";
import { dataLonga, hora } from "@/lib/format";

export default function Home() {
  const proximos = proximosJogos(4);
  const ultimos = ultimosResultados(4);
  const artilheiros = artilharia().slice(0, 5);
  const final = jogos.find((j) => j.fase === "final")!;
  const proximo = proximos[0];
  const comecou = ultimos.length > 0;
  const dono = campeao();

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="relative -mt-16 overflow-hidden pt-16">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {/* refletores */}
          <div className="absolute -top-32 left-[8%] h-[140%] w-48 rotate-[24deg] bg-gradient-to-b from-sky/25 via-sky/5 to-transparent blur-2xl" />
          <div className="absolute -top-32 left-[30%] h-[120%] w-24 rotate-[12deg] bg-gradient-to-b from-white/10 to-transparent blur-2xl" />
          <div className="absolute -top-32 right-[10%] h-[140%] w-48 -rotate-[24deg] bg-gradient-to-b from-gold/20 via-gold/5 to-transparent blur-2xl" />
          {/* brilho central */}
          <div className="absolute right-[-10%] top-[10%] h-[40rem] w-[40rem] rounded-full bg-royal/30 blur-[140px] lg:right-[5%]" />
          {/* quadra em perspectiva */}
          <div className="absolute inset-x-0 bottom-0 h-[60%] overflow-hidden [perspective:900px]">
            <div className="absolute bottom-[-30%] left-1/2 w-[170%] max-w-none sm:w-[130%]" style={{ transform: "translateX(-50%) rotateX(64deg)" }}>
              <CourtLines className="h-auto w-full text-sky/25" />
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-ink to-transparent" />
        </div>

        <div className="container-x relative grid min-h-[calc(100dvh-4rem)] items-center gap-8 py-10 lg:grid-cols-[1.15fr_0.85fr] lg:py-16">
          {/* logo */}
          <div className="relative mx-auto w-[min(72vw,300px)] animate-fade-up sm:w-[340px] lg:order-2 lg:w-full lg:max-w-[460px]">
            <div className="absolute inset-[6%] animate-pulse-glow rounded-full bg-royal/50 blur-[70px]" />
            <div className="absolute inset-[22%] rounded-full bg-gold/30 blur-[60px]" />
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full animate-spin-slow text-gold/30" fill="none" aria-hidden>
              <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="0.3" strokeDasharray="0.6 2.2" />
              <circle cx="50" cy="50" r="43" stroke="currentColor" strokeWidth="0.15" />
            </svg>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset("/images/logo-copa-varzea.webp")}
              alt={`${config.nome} ${config.edicao}`}
              width={480}
              height={480}
              fetchPriority="high"
              className="relative w-full animate-float drop-shadow-[0_30px_50px_rgba(0,0,0,0.6)]"
            />
          </div>

          {/* texto */}
          <div className="relative text-center lg:text-left">
            <p className="eyebrow animate-fade-up [animation-delay:100ms]">
              {config.organizador} apresenta
            </p>
            <h1 className="mt-3 font-display leading-[0.82] tracking-wide">
              <span className="block animate-fade-up text-[5.5rem] [animation-delay:180ms] sm:text-[8rem] lg:text-[10rem]">Copa</span>
              <span className="-my-[0.16em] block animate-fade-up text-[5.5rem] text-shine [animation-delay:260ms] sm:text-[8rem] lg:text-[10rem]">Várzea</span>
            </h1>
            <div className="mt-4 flex animate-fade-up flex-wrap items-center justify-center gap-x-4 gap-y-2 font-cond text-sm font-semibold uppercase tracking-[0.28em] text-sky [animation-delay:340ms] lg:justify-start">
              <span>{config.modalidade}</span>
              <span className="h-1 w-1 rounded-full bg-gold" />
              <span>{config.cidade}/{config.estado}</span>
              <span className="h-1 w-1 rounded-full bg-gold" />
              <span>{config.edicao}</span>
            </div>
            <p className="mx-auto mt-6 max-w-lg animate-fade-up text-lg text-muted [animation-delay:420ms] lg:mx-0">
              Doze equipes, {jogos.length} jogos e uma única taça. A várzea de {config.cidade} entra em quadra para
              descobrir quem é o melhor do futsal.
            </p>

            <div className="mt-8 flex animate-fade-up flex-col items-center gap-3 [animation-delay:500ms] lg:items-start">
              {dono ? (
                <p className="font-display text-3xl tracking-wide">
                  Campeão: <span className="text-gold">{dono.nome}</span>
                </p>
              ) : proximo ? (
                <>
                  <p className="font-cond text-xs font-semibold uppercase tracking-[0.28em] text-muted">
                    {comecou ? "Próximo jogo" : "Contagem para a abertura"} · {dataLonga(proximo.data)} · {hora(proximo.hora)}
                  </p>
                  <Countdown alvo={`${proximo.data}T${proximo.hora}:00-03:00`} encerrado={<p className="font-display text-4xl text-gold">Bola rolando!</p>} />
                </>
              ) : null}
            </div>

            <div className="mt-8 flex animate-fade-up flex-wrap justify-center gap-3 [animation-delay:580ms] lg:justify-start">
              <Link href="/jogos" className="btn btn-gold">Tabela de jogos</Link>
              <Link href="/classificacao" className="btn btn-ghost">Classificação</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FAIXA DE ESCUDOS ================= */}
      <section className="relative border-y border-line bg-night/70 py-6" aria-label="Equipes participantes">
        <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
          <ul className="flex w-max animate-marquee gap-12 hover:[animation-play-state:paused]">
            {[...times, ...times].map((t, i) => (
              <li key={`${t.id}-${i}`} aria-hidden={i >= times.length}>
                <Link href={`/times/${t.id}`} className="flex items-center gap-3 opacity-80 transition-opacity hover:opacity-100" tabIndex={i >= times.length ? -1 : undefined}>
                  <Crest time={t} size={52} eager />
                  <span className="whitespace-nowrap font-cond text-lg font-bold uppercase tracking-wider text-text/90">{t.nome}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ================= NÚMEROS ================= */}
      <section className="container-x py-20">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {[
            { n: times.length, l: "Equipes", d: "na disputa" },
            { n: grupos.length, l: "Grupos", d: "de três equipes" },
            { n: jogos.length, l: "Jogos", d: "de 05/01 a 12/02" },
            { n: 1, l: "Taça", d: "para um campeão", gold: true },
          ].map((s) => (
            <div key={s.l} className={`${s.gold ? "card-gold" : "card"} reveal p-5 sm:p-7`}>
              <p className={`font-display text-7xl leading-none sm:text-8xl ${s.gold ? "text-gold" : ""}`}>{s.n}</p>
              <p className="mt-2 font-cond text-lg font-bold uppercase tracking-[0.18em]">{s.l}</p>
              <p className="text-sm text-muted">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FORMATO ================= */}
      <section className="container-x pb-20">
        <SectionTitle eyebrow="Formato" titulo={<>O caminho até a <span className="text-gold">taça</span></>} href="/mata-mata" linkLabel="Ver chaveamento" />
        <ol className="relative grid gap-4 md:grid-cols-4">
          <div className="absolute left-0 right-0 top-[2.15rem] hidden h-px bg-gradient-to-r from-sky/10 via-sky/40 to-gold/70 md:block" aria-hidden />
          {config.fases.map((f, i) => {
            const ultima = i === config.fases.length - 1;
            return (
              <li key={f.id} className="reveal relative">
                <div className={`relative z-10 mb-4 grid h-[4.3rem] w-[4.3rem] place-items-center rounded-full border font-display text-3xl ${
                  ultima ? "border-gold/60 bg-gradient-to-b from-gold/30 to-gold-deep/20 text-gold shadow-[0_0_40px_rgba(244,197,66,0.35)]" : "border-line-strong bg-surface text-sky"
                }`}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className={`${ultima ? "card-gold" : "card"} p-5`}>
                  <p className="font-cond text-xs font-semibold uppercase tracking-[0.2em] text-muted">{f.periodo}</p>
                  <h3 className={`mt-1 font-display text-3xl tracking-wide ${ultima ? "text-gold" : ""}`}>{f.nome}</h3>
                  <p className="mt-2 text-sm text-muted">{f.descricao}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* ================= GRUPOS ================= */}
      <section className="relative overflow-hidden border-y border-line bg-night/60 py-20">
        <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-[50rem] -translate-x-1/2 rounded-full bg-royal/15 blur-[120px]" aria-hidden />
        <div className="container-x relative">
          <SectionTitle
            eyebrow={sorteio.realizado ? "Fase de grupos" : "Sorteio dos grupos"}
            titulo={sorteio.realizado ? "Os grupos" : <>Grupos <span className="text-gold">em breve</span></>}
            href="/classificacao"
            linkLabel="Classificação"
          />
          {!sorteio.realizado && (
            <p className="-mt-4 mb-8 max-w-2xl text-muted">
              O sorteio vai definir quem ocupa cada posição da tabela. Assim que acontecer, os confrontos, grupos e
              classificação são atualizados automaticamente.
            </p>
          )}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {grupos.map((g) => (
              <div key={g} className="card reveal overflow-hidden">
                <div className="flex items-center justify-between border-b border-line px-5 py-4">
                  <span className="font-display text-3xl tracking-wide">Grupo <span className="text-gold">{g}</span></span>
                  <span className="chip">{config.classificadosPorGrupo} avançam</span>
                </div>
                <ul className="divide-y divide-line">
                  {classificacaoDoGrupo(g).map((l) => (
                    <li key={l.participante.chave} className="flex items-center gap-3 px-5 py-3">
                      <Crest participante={l.participante} size={36} />
                      <span className={`truncate font-cond font-bold uppercase tracking-wide ${l.participante.time ? "" : "text-dim"}`}>
                        {l.participante.rotulo}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= JOGOS ================= */}
      <section className="container-x py-20">
        {ultimos.length > 0 && (
          <div className="mb-16">
            <SectionTitle eyebrow="Placar" titulo="Últimos resultados" href="/jogos" />
            <div className="grid gap-4 md:grid-cols-2">
              {ultimos.map((j) => <MatchCard key={j.id} jogo={j} />)}
            </div>
          </div>
        )}
        {proximos.length > 0 && (
          <>
            <SectionTitle eyebrow="Agenda" titulo={comecou ? "Próximos jogos" : "Rodada de abertura"} href="/jogos" linkLabel="Tabela completa" />
            <div className="grid gap-4 md:grid-cols-2">
              {proximos.map((j) => <MatchCard key={j.id} jogo={j} />)}
            </div>
          </>
        )}
      </section>

      {/* ================= ARTILHARIA ================= */}
      {artilheiros.length > 0 && (
        <section className="container-x pb-20">
          <SectionTitle eyebrow="Goleadores" titulo="Artilharia" href="/artilharia" />
          <ol className="card divide-y divide-line">
            {artilheiros.map((a, i) => (
              <li key={`${a.time.id}-${a.jogador}`} className="flex items-center gap-4 px-5 py-3">
                <span className={`w-6 font-display text-2xl ${i === 0 ? "text-gold" : "text-dim"}`}>{i + 1}</span>
                <Crest time={a.time} size={36} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold">{a.jogador}</span>
                  <span className="block truncate text-xs text-muted">{a.time.nome}</span>
                </span>
                <span className="font-display text-3xl tabular">{a.gols}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* ================= EQUIPES ================= */}
      <section className="container-x pb-20">
        <SectionTitle eyebrow="Participantes" titulo="As 12 equipes" href="/times" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {times.map((t) => (
            <Link
              key={t.id}
              href={`/times/${t.id}`}
              className="card reveal group flex flex-col items-center gap-3 overflow-hidden px-3 py-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-line-strong"
            >
              <span
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: `radial-gradient(60% 50% at 50% 35%, ${t.cor}33, transparent 70%)` }}
              />
              <Crest time={t} size={104} className="relative transition-transform duration-500 group-hover:scale-110" />
              <span className="relative font-cond text-base font-bold uppercase tracking-wider">{t.nome}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= FINAL ================= */}
      <section className="container-x">
        <div className="card-gold reveal relative overflow-hidden px-6 py-14 text-center sm:px-12">
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/20 blur-[100px]" />
            <CourtLines className="absolute left-1/2 top-1/2 w-[120%] max-w-none -translate-x-1/2 -translate-y-1/2 text-gold/[0.08]" />
          </div>
          <p className="eyebrow relative">Grande final · {dataLonga(final.data)} · {hora(final.hora)}</p>
          <h2 className="relative mt-3 font-display text-6xl leading-[0.9] tracking-wide sm:text-8xl">
            Quem vai levantar <br className="hidden sm:block" />
            <span className="text-shine">a taça?</span>
          </h2>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/mata-mata" className="btn btn-gold">Ver o chaveamento</Link>
            <Link href="/times" className="btn btn-ghost">Conhecer as equipes</Link>
          </div>
        </div>
      </section>
    </>
  );
}
