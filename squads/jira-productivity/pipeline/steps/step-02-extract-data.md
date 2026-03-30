---
execution: subagent
agent: analyst
inputFile: squads/jira-productivity/output/research-focus.md
outputFile: squads/jira-productivity/output/raw-metrics.md
model_tier: powerful
---

# Step 02: Extração e Análise de Dados

## Context Loading

Load these files before executing:
- `squads/jira-productivity/output/research-focus.md` — Parâmetros definidos pelo usuário
- `squads/jira-productivity/pipeline/data/domain-framework.md` — Metodologia de cálculo de métricas ágeis
- `squads/jira-productivity/pipeline/data/anti-patterns.md` — Erros a evitar na análise
- `squads/goals-tracker/pipeline/data/jira-queries.md` — **SLA N3 &lt; 48h:** JQL canônica, lista `assignee IN`, definição **created → resolutiondate** ≤48h (meta 50% no `squad-goals.md` do Goals Tracker).
- `relatorio_consolidado_2026-03-12_2026-03-25.html` — Fonte de verdade dos dados históricos e do período atual (quando aplicável).

## Instructions

O relatório final **sempre** inclui `dashboard-final.html` com a estrutura atual em `pipeline/data/dashboard-layout-reference.html`. O `raw-metrics.md` deve trazer explicitamente os valores necessários para preencher esses blocos (cards da Diretoria — **incluindo SLA N3**, tabelas da Gestão, séries para o gráfico de 30 SP/pessoa, pivots ≤7 meses).

### Process
1. Leia os parâmetros do usuário em `research-focus.md`.
2. **Consolidado HTML (quando existir no escopo do run):** Leia `relatorio_consolidado_*.html` se for a fonte acordada. Use as tabelas/KPIs para fluxo, alertas e pivots.
3. **SLA N3 &lt; 48h (obrigatório documentar em todo run):** Alinhar à seção **N3** de `squads/goals-tracker/pipeline/data/jira-queries.md` — mesmo `project IN (N3)`, mesmo `assignee IN` (oito nomes do `_memory/memories.md`), issues **resolvidas no período** do relatório. Para cada issue: Δ = **`resolutiondate` − `created`**; contar quantas têm Δ ≤ **48 horas**; **share %** = (dentro do SLA / total no filtro) × 100; **alvo formal 50%** (metade da meta “Suporte ao cliente integrado”). Se o consolidado HTML **não** tiver `created`/`resolutiondate` por ticket, usar **MCP Jira** (`search_jira` ou equivalente) com a JQL do arquivo (datas ajustadas ao período) e `fields` incluindo `created`, `resolutiondate`. Se `resolutiondate` não vier no payload, declarar uso de proxy (ex.: `updated`) explicitamente — ideal é **sempre** `resolutiondate` para esta métrica. Se a amostra truncar em 100 issues, citar paginação ou “primeiros N”.
4. Extraia as demais métricas de fluxo, qualidade e suporte (throughput, alertas, pivots ≤7 meses) das fontes disponíveis (HTML e/ou MCP).
5. Identifique gargalos e anomalias.
6. Escreva o relatório de dados brutos e insights preliminares.

## Output Format

The output MUST follow this exact structure:
```markdown
# Dados Brutos e Insights Preliminares

## Parâmetros da Busca
- Projeto: [Projeto]
- Período: [Período]
- Total de Issues Analisadas: [Número]

## Métricas de Fluxo
- Throughput: [Número] itens
- Cycle Time Mediano: [Número] dias
- Cycle Time p90: [Número] dias
- WIP Médio Estimado: [Número] itens
- Story Points Total: [Número]
- **Story Points alocados na sprint (INTS + IOAM):** [Número] — soma de pontos no board da sprint atual nos dois projetos
- Story Points por Pessoa: [Lista]
- Tarefas [MELHORIA]: [Número]
- Tarefas [PROATIVA]: [Número]

## Métricas de Qualidade
- Alertas Criados: [Número]
- Alertas Resolvidos: [Número]
- Saldo de Alertas: [Número]
- Alertas Resolvidos por Pessoa: [Lista]
- Alertas por Prioridade: [Lista]
- Tempo Médio de Resolução por Prioridade: [Lista]

## Métricas de Suporte (N3)
- Tickets N3 Resolvidos (empresa): [Número] — opcional, para contexto
- **Tickets N3 resolvidos pelo time de integrações:** [Número] — somente assignees do escopo do squad (`_memory/memories.md`); base do **card N3** na Diretoria
- Tickets N3 por Pessoa (time): [Lista]
- **SLA N3 &lt; 48h (Goals Tracker — 50% da meta Suporte):**
  - **JQL usada** (resumo ou colar JQL completa com datas do período): [texto]
  - **N** issues no filtro (resolvidas no período, assignees squad): [Número]
  - **Dentro do SLA** (Δ created→resolutiondate ≤ 48h): [Número]
  - **Share %:** [Número]% — comparar com **alvo 50%** (≥ alvo = “dentro”; &lt; alvo = “abaixo”)
  - **Campo de fim usado:** `resolutiondate` / proxy [qual] — justificar se não for `resolutiondate`
  - **Truncamento/paginação:** [sim/não — detalhe]

## Histórico e Tendências (pivot mensal)
- [Resumo da evolução histórica]
- **Regra para HTML:** nas tabelas pivot mensais, incluir **no máximo 7 colunas de mês** (nunca mais que 7); mesmos rótulos de mês e `data-month-key` sequencial (0…6) em todas as tabelas da seção 3 para o filtro funcionar

## Identificação de Padrões
- Gargalo Principal: [Status com maior gargalo]
- Anomalias: [Lista de issues fora do padrão]

## Insights (com implicação de negócio)
1. [Insight 1] - Isso significa que...
2. [Insight 2] - Isso significa que...
```

## Output Example

# Dados Brutos e Insights Preliminares

## Parâmetros da Busca
- Projeto: PROJ
- Período: Últimos 14 dias
- Total de Issues Analisadas: 45

## Métricas de Fluxo
- Throughput: 45 itens
- Cycle Time Mediano: 3.1 dias
- Cycle Time p90: 5.2 dias
- WIP Médio Estimado: 12 itens

## Métricas de Qualidade
- Bugs Criados: 12
- Bugs Resolvidos: 8
- Taxa de Escape: 15%

## Identificação de Padrões
- Gargalo Principal: Status "Aguardando Code Review" (média de 2.5 dias)
- Anomalias: PROJ-1024 levou 8 dias em Review.

## Insights
1. O throughput aumentou 15%, mas o p90 subiu para 5.2 dias. Isso significa que estamos entregando mais, porém com menos previsibilidade.
2. O gargalo em Code Review indica sobrecarga. Isso significa que o time está codificando mais rápido do que consegue revisar.

## Veto Conditions

Reject and redo if ANY of these are true:
1. Os dados não baterem com as fontes acordadas (HTML e/ou MCP) sem explicação documentada.
2. Os insights não incluem a implicação de negócio ("Isso significa que...").
3. A seção **SLA N3 &lt; 48h** estiver ausente ou vaga quando o período e o escopo N3 forem aplicáveis — ao mínimo: N, share % ou lacuna explícita (ex.: MCP indisponível) e referência à JQL em `jira-queries.md` (Goals Tracker).

## Quality Criteria

- [ ] Os dados foram extraídos das fontes definidas (HTML e/ou MCP).
- [ ] As métricas de qualidade (bugs/alertas) estão presentes quando o escopo incluir.
- [ ] O gargalo principal foi identificado.
- [ ] **SLA N3** documentado (números ou lacuna justificada) alinhado a `goals-tracker/.../jira-queries.md`.