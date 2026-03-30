---
execution: inline
agent: writer
inputFile: squads/goals-tracker/output/analysis-brief.md
outputFile: squads/goals-tracker/output/leadership-report.md
---

# Step 03: Redação — Relatório de Liderança e Relatório de Time

**Regra persistente:** Em **qualquer** solicitação de novo ou atualizado relatório de liderança, manter **sempre** o padrão canônico do run `2026-03-26-112700` (ver `_memory/memories.md` → “Padrão fixo”). Não alternar para layout longo salvo mudança explícita de produto nesses arquivos.

## Context Loading

Load these files before executing:
- `squads/goals-tracker/pipeline/data/squad-goals.md` — Nomes e pesos das metas; o **Status das metas (RAG)** deve cobrir **estas** quatro áreas (não substituir por outro framework).
- `squads/goals-tracker/output/analysis-brief.md` — RAG, bloqueios e notas para o escritor produzidos por Alice Análise.
- `squads/goals-tracker/output/research-snapshot.md` — Conferência de números e fontes quando o brief citar dados crus.
- `squads/goals-tracker/pipeline/data/output-examples.md` — Exemplos de tom e estrutura dos dois relatórios.
- `squads/goals-tracker/pipeline/data/quality-criteria.md` — Critérios de aceite por audiência.
- `squads/goals-tracker/pipeline/data/anti-patterns.md` — O que não fazer (jargão vazio, métricas de vaidade, etc.).

## Instructions

### Process
1. **Planejar:** Do brief e `research-snapshot.md`, extraia resumo executivo (1 frase + 2–4 bullets), RAG pelas quatro áreas de `squad-goals.md`, bloqueios (Five Whats) para mapear em **5W2H**, e próximos passos para liderança; para o time, foco, entregas, travamentos e reconhecimentos.
2. **Relatório de Liderança (formato canônico — espelho do run `2026-03-26-112700` + frentes + 5W2H):** Salve em `leadership-report.md` (caminho `outputFile`). **Ordem fixa:** `#` título → `## Resumo executivo (1 frase + 2–4 bullets)` → `## Status das metas (RAG)` → **`## Andamento por frente (explícito)`** → **`## Impedimentos e decisões (Five Whats e 5W2H)`** → `## Próximos passos recomendados (liderança)`.
   - **Andamento por frente (obrigatório):** Tabela Markdown com **uma linha por frente** alinhada a `squad-goals.md`: incluir, no mínimo, as linhas do run de referência (SLA alertas U/A, saúde planilha, INTS-645, edição integração, INTS-659, INTS-643, INTS-662, tickets/integração N3, SLA N3 &lt;48h, INTS-587, 30 pts/sprint). Colunas: **Frente** | **Peso / meta** | **Rastreio** (chave Jira, planilha ou “não medido”) | **Andamento no período** (1 frase factual do snapshot). Se uma frente não tiver dado, declarar lacuna na célula — não omitir a linha.
   - **Impedimentos 5W2H (obrigatório):** Uma tabela Markdown com colunas **# | O quê | Por quê | Onde | Quando | Quem | Como | Quanto**. Cada linha = um bloqueio material do brief, cobrindo o conteúdo dos **Five Whats** (meta/bloqueio/impacto/tentativas/ideal) distribuído nas colunas. Mínimo: tantas linhas quanto bloqueios escalonados no `analysis-brief.md` (referência: 3 linhas no run `2026-03-26-112700`). **Não** substituir por lista numerada longa só em prosa — a tabela é a visão principal.
   - Narrativa executiva; números alinhados ao snapshot. **Proibido:** “Painel gestor”, “Painel de progresso”, seções **A–E**, segundo RAG em tabela separada da agregada, badges Andando/Parado, bloco “Decisões da semana” fora desta seção, doughnuts ou múltiplos gráficos no HTML além de `progressChart`.
3. **Redigir o Relatório de Time:** Salve em `team-report.md` no **mesmo diretório versionado** do run que `leadership-report.md`. Abra com **Painel rápido** (tabela pergunta/resposta com os mesmos números do snapshot/brief). Tom colaborativo; reconhecimentos com nomes e feitos concretos quando o snapshot/brief permitir.
4. **HTML (obrigatório no mesmo run):** Gere `leadership-report.html` e `team-report.html` ao lado dos `.md`. O **`leadership-report.html`** deve seguir `2026-03-26-112700/v1/leadership-report.html`: `<h1>`, resumo em `.highlight`, **um único** `progressChart`, RAG em lista (`rag-green` / `rag-amber` / `rag-red`), **`table.frentes-table`**, **`h2` Impedimentos (Five Whats e 5W2H) + `div.w2h-wrap` + `table.w2h-table`** (8 colunas), próximos passos. **Sem** painel gestor, doughnuts extras nem A–E. `datasets` do gráfico = snapshot.
5. **Consistência:** Alinhe números, datas e keys entre os dois relatórios, o snapshot e os HTML; divergências não resolvidas → risco no texto de liderança.
6. **Auto-verificação:** Confira `quality-criteria.md` para cada relatório.

## Output Format

The primary file `leadership-report.md` MUST follow this exact structure (same as run `2026-03-26-112700`, incluindo frentes):
```markdown
# Relatório de Liderança — Goals Tracker

## Resumo executivo (1 frase + 2–4 bullets)
**Frase:** ...
- ...
- ...

## Status das metas (RAG)
- **Gestão de alertas:** [🟢/🟡/🔴] ...
- **Eficiência máxima:** ...
- **Suporte integrado:** ...
- **Produtividade:** ...

## Andamento por frente (explícito)
(Uma linha introdutória opcional.)

| Frente | Peso / meta | Rastreio | Andamento no período |
|--------|-------------|----------|----------------------|
| ... | ... | ... | ... |

## Impedimentos e decisões (Five Whats e 5W2H)
(Parágrafo curto: tabela = Five Whats em colunas 5W2H.)

| # | O quê | Por quê | Onde | Quando | Quem | Como | Quanto |
|---|-------|---------|------|--------|------|------|--------|
| 1 | … | … | … | … | … | … | … |

## Próximos passos recomendados (liderança)
1. ...
2. ...
```

The secondary file `team-report.md` MUST follow this exact structure:
```markdown
# Relatório de Time — Goals Tracker

## Painel rápido — onde está o progresso
(Tabela pergunta/resposta com números do período.)

## Foco da semana
...

## O que entregamos
- ...

## Onde estamos travados
...

## Decisões (e por quê)
...

## Reconhecimentos
- **Nome:** ...

## Como se envolver / feedback
...
```

## Output Example

# Relatório de Liderança — Goals Tracker

## Resumo executivo (1 frase + 2–4 bullets)
**Frase:** Eficiência máxima em risco por arquitetura pendente; demais metas no plano.
- Plataforma RM Totvs e ADP API entregues; base para edição.
- INTS-645 sem data de decisão — risco de atraso no PLAT-100.
- SLAs e alertas dentro da meta.

## Status das metas (RAG)
- **Gestão de alertas:** 🟢 Coerente com a meta semestral.
- **Eficiência máxima:** 🟡 Edição depende de arquitetura — decisão até sexta-feira.

## Andamento por frente (explícito)
| Frente | Peso / meta | Rastreio | Andamento no período |
|--------|-------------|----------|----------------------|
| SLA alertas U/A | 50% | Jira | … |
| INTS-645 | 20% | INTS-645 | … |

## Impedimentos e decisões (Five Whats e 5W2H)
| # | O quê | Por quê | Onde | Quando | Quem | Como | Quanto |
|---|-------|---------|------|--------|------|------|--------|
| 1 | Edição na plataforma parada | Arquitetura não decidida | INTS-645 | Até sexta | Arquitetura + EM | Workshop + decisão no épico | 1 sprint de risco |

## Próximos passos recomendados (liderança)
1. Confirmar com arquitetura data e critério de aceite do módulo de edição.

# Relatório de Time — Goals Tracker

## Foco da semana
Avançar na meta de eficiência máxima habilitando a plataforma para novos providers e reduzindo o tempo médio de resolução de alertas críticos.

## O que entregamos
- Primeira versão da plataforma para RM Totvs (PLAT-100).
- Melhoria no fluxo de alertas N8N — tempo médio de resolução em 1,5 dia.

## Onde estamos travados
Aguardamos a definição de arquitetura para a edição de integrações na plataforma; isso determina o próximo incremento do épico.

## Decisões (e por quê)
Priorizamos ADP API antes da integração Sênior pelo impacto no cliente no curto prazo — alinhado com o roadmap comercial.

## Reconhecimentos
- **Adriel e Bruna:** Refatoração que permitiu antecipar a entrega RM Totvs.

## Como se envolver / feedback
Comentários na INTS-645 ou sync de quinta-feira.

## Veto Conditions

Reject and redo if ANY of these are true:
1. Os dois arquivos não foram salvos (`leadership-report.md` e `team-report.md`) no mesmo run, ou um deles está ausente.
2. O Relatório de Liderança usa métricas de vaidade sem ligação a resultado (ex.: story points isolados) ou omite decisões claras onde há bloqueio âmbar ou vermelho.
3. `leadership-report.md` ou `leadership-report.html` inclui **Painel gestor**, **Painel de progresso**, seções **A–E**, múltiplos gráficos Chart.js além de `progressChart`, **falta** `## Andamento por frente (explícito)` com tabela alinhada a `squad-goals.md`, **falta** `## Impedimentos e decisões (Five Whats e 5W2H)` com **tabela 5W2H** (8 colunas) em vez de lista numerada como única forma, ou estrutura diferente do run de referência `2026-03-26-112700`.

## Quality Criteria

- [ ] Liderança: teste 30–60s em `quality-criteria.md`.
- [ ] Time: sem jargão de `anti-patterns.md`; reconhecimentos específicos quando possível.
- [ ] Números/keys alinhados ao snapshot; `team-report.md` no mesmo diretório que `leadership-report.md`.
