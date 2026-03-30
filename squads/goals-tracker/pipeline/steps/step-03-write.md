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
1. **Planejar:** Do brief e `research-snapshot.md`, extraia resumo executivo (1 frase + 2–4 bullets), RAG pelas quatro áreas de `squad-goals.md`, bloqueios no formato Five Whats e próximos passos para liderança; para o time, foco, entregas, travamentos e reconhecimentos.
2. **Relatório de Liderança (formato canônico — espelho do run `2026-03-26-112700`):** Salve em `leadership-report.md` (caminho `outputFile`). **Ordem fixa:** apenas `#` título, `## Resumo executivo (1 frase + 2–4 bullets)`, `## Status das metas (RAG)`, `## Impedimentos e decisões (Five Whats)`, `## Próximos passos recomendados (liderança)`. Narrativa executiva; números alinhados ao snapshot. **Proibido** neste arquivo: “Painel gestor”, “Painel de progresso”, seções A–E, tabelas operacionais longas, segundo RAG em tabela, badges Andando/Parado, bloco “Decisões da semana” separado do Five Whats.
3. **Redigir o Relatório de Time:** Salve em `team-report.md` no **mesmo diretório versionado** do run que `leadership-report.md`. Abra com **Painel rápido** (tabela pergunta/resposta com os mesmos números do snapshot/brief). Tom colaborativo; reconhecimentos com nomes e feitos concretos quando o snapshot/brief permitir.
4. **HTML (obrigatório no mesmo run):** Gere `leadership-report.html` e `team-report.html` ao lado dos `.md`. O **`leadership-report.html`** deve seguir **o mesmo layout** que `squads/goals-tracker/output/2026-03-26-112700/v1/leadership-report.html`: `<h1>`, `## Resumo executivo` em `.highlight`, **um único** gráfico Chart.js `progressChart` (barras **Atual** vs **Meta**, sete rótulos: Tempo Alertas, Saúde Integrações, Eficiência Máxima, Tickets/Integração, SLA Tickets &lt; 48h, Cobertura Workflows, Produtividade), depois RAG em lista com classes `rag-green` / `rag-amber` / `rag-red`, Five Whats, próximos passos. **Sem** painel gestor, doughnuts extras, gráficos de governança nem seções A–E. Preencha `datasets` com valores do snapshot (como no run de referência).
5. **Consistência:** Alinhe números, datas e keys entre os dois relatórios, o snapshot e os HTML; divergências não resolvidas → risco no texto de liderança.
6. **Auto-verificação:** Confira `quality-criteria.md` para cada relatório.

## Output Format

The primary file `leadership-report.md` MUST follow this exact structure (same as run `2026-03-26-112700`):
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

## Impedimentos e decisões (Five Whats)
1. **Título curto** — Bloqueado por …; impacto …; ideal: …
2. ...

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

## Impedimentos e decisões (Five Whats)
1. **Edição de integração** — Bloqueado por definição arquitetural (INTS-645); impacto em PLAT-100; tentativas: workshops e proposta provisória; ideal: decisão documentada com opção escolhida e owner.

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
3. `leadership-report.md` ou `leadership-report.html` inclui **Painel gestor**, **Painel de progresso**, seções **A–E**, múltiplos gráficos Chart.js além de `progressChart`, ou estrutura diferente do run de referência `2026-03-26-112700`.

## Quality Criteria

- [ ] Liderança: teste 30–60s em `quality-criteria.md`.
- [ ] Time: sem jargão de `anti-patterns.md`; reconhecimentos específicos quando possível.
- [ ] Números/keys alinhados ao snapshot; `team-report.md` no mesmo diretório que `leadership-report.md`.
