import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Barlow_Condensed, Inter } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { config } from "@/lib/campeonato";

const bebas = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-bebas", display: "swap" });
const barlow = Barlow_Condensed({ weight: ["500", "600", "700"], subsets: ["latin"], variable: "--font-barlow", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

const owner = process.env.GITHUB_REPOSITORY_OWNER;
const repo = process.env.GITHUB_REPOSITORY?.split("/")[1];
const siteUrl =
  process.env.SITE_URL ??
  (owner && repo ? `https://${owner.toLowerCase()}.github.io/${repo.endsWith(".github.io") ? "" : repo}` : "http://localhost:3000");

const titulo = `${config.nome} ${config.edicao}`;
const descricao = `Tabela, jogos, classificação, mata-mata e artilharia da ${config.nome} ${config.edicao} — ${config.modalidade} em ${config.cidade}/${config.estado}. Organização: ${config.organizador}.`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl.endsWith("/") ? siteUrl : `${siteUrl}/`),
  title: { default: `${titulo} · ${config.modalidade} ${config.cidade}`, template: `%s · ${titulo}` },
  description: descricao,
  openGraph: {
    title: titulo,
    description: descricao,
    type: "website",
    locale: "pt_BR",
    siteName: titulo,
    images: [{ url: "og.jpg", width: 1200, height: 630, alt: titulo }],
  },
  twitter: { card: "summary_large_image", title: titulo, description: descricao, images: ["og.jpg"] },
};

export const viewport: Viewport = {
  themeColor: "#03050b",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${bebas.variable} ${barlow.variable} ${inter.variable}`}>
      <body className="min-h-dvh flex flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
