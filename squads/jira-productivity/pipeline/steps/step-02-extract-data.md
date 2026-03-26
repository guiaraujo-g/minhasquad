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
- `relatorio_consolidado_2026-03-12_2026-03-25.html` — Fonte de verdade dos dados históricos e do período atual.

## Instructions

### Process
1. Leia os parâmetros do usuário em `research-focus.md`.
2. **MUITO IMPORTANTE:** Leia o arquivo `relatorio_consolidado_2026-03-12_2026-03-25.html`. Ele contém a base histórica completa e os dados reais do período. Use EXCLUSIVAMENTE os dados deste arquivo para preencher as métricas (ex: 177 Story Points, 816 Alertas resolvidos, 460 criados, etc).
3. Extraia as métricas de fluxo, qualidade e suporte diretamente das tabelas e KPIs do arquivo HTML. Extraia também a base histórica (pivot mensal) para identificar tendências (ex: evolução de agosto/25 a março/26).
4. Identifique gargalos e anomalias com base nos dados históricos (ex: aumento repentino de alertas em um mês específico).
5. Escreva um relatório de dados brutos e insights preliminares.

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
- Tickets N3 Resolvidos: [Número]
- Tickets N3 por Pessoa: [Lista]

## Histórico e Tendências (Agosto/25 a Março/26)
- [Resumo da evolução histórica baseada nas tabelas pivot do HTML]

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
1. Os dados não baterem com o arquivo HTML fornecido.
2. Os insights não incluem a implicação de negócio ("Isso significa que...").

## Quality Criteria

- [ ] Os dados foram extraídos do arquivo HTML.
- [ ] As métricas de qualidade (bugs) estão presentes.
- [ ] O gargalo principal foi identificado.