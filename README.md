# Copa Várzea 2027

Site oficial da Copa Várzea de futsal, em Botucatu/SP, organizada pelo **Várzea Botucatu**: tabela de jogos, classificação, mata-mata, artilharia e página de cada equipe.

Stack: Next.js (exportação estática), Tailwind CSS e dados em JSON. O deploy no GitHub Pages é automático a cada push na `main`.

## Como atualizar o campeonato

Todo o conteúdo vem da pasta `data/`. Classificação, chaveamento, artilharia e página inicial são **calculados automaticamente** a partir desses arquivos.

### 1. Depois do sorteio: `data/sorteio.json`

Diga qual time ocupa cada número da tabela ("Equipe 1" a "Equipe 12") e marque `realizado: true`:

```json
{
  "realizado": true,
  "data": "2026-12-10",
  "equipes": { "1": "phenix", "2": "cabare", "3": "pitaco", "...": "..." }
}
```

Os ids dos times estão em `data/times.json`. Os grupos são formados assim: A = equipes 1 a 3, B = 4 a 6, C = 7 a 9 e D = 10 a 12.

### 2. Lançar um resultado: `data/jogos.json`

Encontre o jogo, preencha o placar, os gols (para a artilharia) e mude o `status`:

```json
{ "id": "G01", "...": "...", "golsCasa": 4, "golsFora": 2, "status": "realizado",
  "gols": [
    { "lado": "casa", "jogador": "Fulano", "qtd": 2 },
    { "lado": "casa", "jogador": "Ciclano" },
    { "lado": "fora", "jogador": "Beltrano", "qtd": 2 }
  ] }
```

No mata-mata, em caso de empate, preencha também `penaltisCasa` e `penaltisFora`.
Outros status possíveis: `"agendado"` e `"adiado"`. O campo opcional `obs` mostra uma observação no card do jogo.

### 3. Outras informações: `data/config.json`

Local dos jogos (`local`), critérios de desempate, textos das fases etc.

## Rodando localmente

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # gera o site estático em out/
```

## Escudos

Os escudos em `public/images/times/` foram gerados a partir das imagens originais em `imagens/` com `scripts/processar-escudos.py`, que recorta, remove o fundo e padroniza em 512×512.
