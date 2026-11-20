/**
 * Corrige um desencontro do Next 16 no `output: "export"`:
 * o build grava os arquivos de prefetch em pastas (ex.: jogos/__next.jogos/__PAGE__.txt),
 * mas o navegador os procura em formato "achatado" (jogos/__next.jogos.__PAGE__.txt).
 * Este script cria as cópias achatadas para a navegação entre páginas ficar instantânea.
 */
import { copyFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const OUT = "out";
let criados = 0;

function walk(dir) {
  for (const nome of readdirSync(dir)) {
    const caminho = join(dir, nome);
    if (!statSync(caminho).isDirectory()) continue;
    if (nome.startsWith("__next.")) achatar(dir, caminho);
    else if (nome !== "_next") walk(caminho);
  }
}

function achatar(rotaDir, segDir) {
  const arquivos = (d) =>
    readdirSync(d).flatMap((n) => {
      const p = join(d, n);
      return statSync(p).isDirectory() ? arquivos(p) : [p];
    });
  for (const arq of arquivos(segDir)) {
    if (!arq.endsWith(".txt")) continue;
    const plano = relative(rotaDir, arq).split(sep).join(".");
    copyFileSync(arq, join(rotaDir, plano));
    criados++;
  }
}

walk(OUT);
console.log(`pos-build: ${criados} arquivos de prefetch ajustados`);
