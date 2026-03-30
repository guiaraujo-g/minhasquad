---
execution: inline
agent: writer
inputFile: squads/jira-productivity/output/raw-metrics.md
outputFile: squads/jira-productivity/output/final-reports.md
---

# Step 03: Criação dos Relatórios

## Context Loading

Load these files before executing:
- `squads/jira-productivity/output/raw-metrics.md` — Dados brutos e insights gerados pelo analista
- `squads/jira-productivity/pipeline/data/output-examples.md` — Exemplos de como estruturar os relatórios
- `squads/jira-productivity/pipeline/data/anti-patterns.md` — Erros a evitar na escrita
- `squads/jira-productivity/pipeline/data/dashboard-layout-reference.html` — Estrutura, CSS e seções obrigatórias do dashboard HTML

## Instructions

**Regra global:** Em **toda** solicitação de novo relatório de produtividade, a saída obrigatória inclui `dashboard-final.html` com a **mesma estrutura de reporte** que o arquivo **`pipeline/data/dashboard-layout-reference.html`** naquele momento (fonte única de verdade do layout). Não reaproveitar estrutura de `dashboard-final.html` de runs antigos em `output/`.

### Process
1. Leia os dados brutos e insights gerados pelo Daniel Dados.
2. Escreva a **Visão Diretoria (Executiva)**: foque em impacto de negócio, riscos, SLAs e previsibilidade. Evite jargões técnicos. Máximo de 5 linhas para o resumo.
3. Escreva a **Visão Gestão**: foque em eficiência do fluxo, gargalos, WIP e qualidade. Inclua recomendações de ajuste de processo.
4. Escreva a **Visão Time (Retrospectiva)**: foque em empatia, celebração de vitórias, identificação de dores (outliers) e combinados práticos para a próxima sprint.

### Dashboard HTML (obrigatório — sempre)

5. **Sempre** gere o arquivo **`dashboard-final.html`** no **mesmo diretório versionado** que `final-reports.md` (aplique a mesma transformação de caminho do Pipeline Runner: `squads/jira-productivity/output/{run_id}/vN/`).
   - **Base obrigatória:** leia o **`dashboard-layout-reference.html` atual** no repositório e reproduza sua estrutura (não confiar em memória nem em HTML exportado de execuções anteriores). Preserve o `<style>`, **Chart.js** (CDN), scripts de filtro de período, as cinco seções colapsáveis (Diretoria, Gestão, Histórica com pivots, Time, Tags) e os padrões de tabelas/cards.
   - **Seção 1 — Visão Diretoria:** os **quatro** cards de métrica permanecem, nesta ordem: (1) **Story Points alocados na sprint** (soma INTS + IOAM); (2) **Tickets N3 resolvidos pelo time** — no **mesmo** card, abaixo do volume, incluir um bloco **SLA N3 &lt; 48h** com dados de `raw-metrics.md`: share **%** (created→resolutiondate ≤48h), **N**, alvo **50%**, status (“dentro” / “abaixo”) e nota se usou proxy de campo — **mesma definição** que `squads/goals-tracker/pipeline/data/jira-queries.md` (seção N3); (3) **Total de alertas criados** (AL); (4) **Total de alertas resolvidos** (AL). O resumo executivo deve mencionar SLA N3 quando o número estiver disponível ou a lacuna for relevante.
   - **Seção 2 — Visão Gestão:** manter o bloco **“Produtividade vs meta (30 SP por pessoa)”** com `<canvas id="chartProdutividadeMeta30">` e o script que preenche `productivityLabels` e `productivitySp` com os **mesmos nomes e valores de SP do período** usados na análise (ex.: SP concluídos na sprint ou na janela do relatório, por pessoa do squad). A linha vermelha tracejada representa a **meta de 30 SP/pessoa**. Na lista **Análise de Fluxo e Gargalos**, pode incluir **uma linha sobre SLA N3** (share vs 50%) se `raw-metrics.md` trouxer o dado.
   - **Seção 3 — Visão Histórica:** manter `#sec-historico`, o filtro (mês inicial / mês final) e **no máximo 7 colunas de mês** em cada `table.table-pivot` desta seção; cabeçalhos de mês com `class="pivot-month"` e `data-month-key="0"` … `"6"` na mesma ordem em **todas** as tabelas da seção. O JavaScript limita a janela visível a **no máximo 7 meses** contíguos.
   - Preencha **todos** os números, textos e tabelas com os dados do run atual (`raw-metrics.md` e fontes citadas pelo analista). Seções 1–2 e 4 alinhadas ao markdown; seções 3 e 5 com pivots/tags conforme extração (≤7 meses na seção 3).
   - Dependência externa permitida: **Chart.js** via CDN (já referenciado no layout).

## Output Format

The output MUST follow this exact structure:
```markdown
# Relatórios de Produtividade

## 1. Visão Diretoria (Relatório Executivo)
**Resumo Executivo:**
[Resumo de até 5 linhas focando em impacto e risco]

**Principais Indicadores:**
- Entregas de Valor: [Dado]
- Previsibilidade: [Dado]
- Qualidade/Risco: [Dado]

**Recomendação Estratégica:**
[Recomendação clara]

---

## 2. Visão Gestão (Análise de Fluxo)
**Análise de Fluxo e Gargalos:**
- Cycle Time Mediano: [Dado]
- Gargalo Identificado: [Análise do gargalo]
- Qualidade: [Análise de bugs]

**Ação Recomendada:**
[Ação focada em processo/WIP]

---

## 3. Visão Time (Retrospectiva)
**Retrospectiva Baseada em Dados:**
Fala time! [Abertura empática]

- **O que foi bem:** [Vitória baseada em dados]
- **Onde doeu:** [Exemplo de issue outlier/gargalo]
- **Para a próxima sprint:** [Sugestão de combinado prático]
```

## Output Example

(Veja o arquivo `output-examples.md` para o exemplo completo de cada visão).

## Veto Conditions

Reject and redo if ANY of these are true:
1. A Visão Diretoria contém jargões não traduzidos (ex: "WIP Limit", "JQL").
2. A Visão Time foca em culpar indivíduos em vez de focar no processo.
3. **`dashboard-final.html` não foi criado** no mesmo diretório versionado que `final-reports.md`, ou está incompleto (falta seção, CSS, **gráfico de produtividade**, **filtro de período** na seção 3, cards da Diretoria fora do padrão, ou **card N3 sem o bloco SLA &lt; 48h** quando `raw-metrics.md` contiver esses números — se houver lacuna documentada no raw-metrics, o card deve exibir a lacuna em texto curto).

## Quality Criteria

- [ ] O Resumo Executivo tem no máximo 5 linhas.
- [ ] Cada visão tem um tom de voz adequado ao seu público.
- [ ] Todas as 3 visões apresentam ações/recomendações claras.
- [ ] **`dashboard-final.html` existe** ao lado de `final-reports.md`, com layout alinhado ao reference e dados do run.