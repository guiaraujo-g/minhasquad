---
execution: inline
agent: analyst
inputFile: squads/goals-tracker/output/research-snapshot.md
outputFile: squads/goals-tracker/output/analysis-brief.md
---

# Step 02: Análise — RAG e Bloqueios

## Context Loading

Load these files before executing:
- `squads/goals-tracker/output/research-snapshot.md` — Snapshot de pesquisa produzido pelo Rafael Relatório.
- `squads/goals-tracker/pipeline/data/domain-framework.md` — Metodologia de impedimentos, Five Whats e ligação meta ↔ bloqueio.
- `squads/goals-tracker/pipeline/data/research-brief.md` — Contexto de reporting e vocabulário de negócio.
- `squads/goals-tracker/pipeline/data/anti-patterns.md` — Erros a evitar na análise (ex.: esconder risco, escalar sem impacto).

## Instructions

### Process
1. **Ingerir o snapshot:** Valide completude; se faltar dado crítico para uma meta, classifique o gap e evite inferências não suportadas pelo snapshot.
2. **Calcular ou atribuir RAG:** Para cada meta ou tema semestral relevante, atribua **Red / Amber / Green** com critérios explícitos (prazo, confiança, dependência, evidência numérica da planilha e do Jira). Use uma legenda única no brief.
3. **Mapear bloqueios:** Liste impedimentos com estrutura **Five Whats** (fazendo, bloqueado por, impacto, tentativas, resolução ideal) onde o snapshot trouxe evidência; marque `Unknown` apenas quando o snapshot não tiver dado.
4. **Priorizar para liderança vs time:** Separe itens que exigem decisão de liderança (escalação, dependência externa, trade-off de prazo) dos que o time pode destravar sozinho.
5. **Produzir o brief:** Escreva `analysis-brief.md` no formato abaixo, em tom analítico e acionável, sem redigir os relatórios finais.

## Output Format

The output MUST follow this exact structure:
```markdown
# Analysis Brief — Goals Tracker

## Executive read (5 bullets max)
- ...

## RAG legend (definitions used here)
- Green: ...
- Amber: ...
- Red: ...

## Per-goal / theme status
| Theme / goal | RAG | Confidence | Evidence summary | Trend vs last period (if known) |
|--------------|-----|------------|------------------|--------------------------------|
| ... | 🟢/🟡/🔴 | High/Med/Low | ... | ... |

## Blockers and dependencies (Five Whats)
### B1 — [short label]
1. **Doing:** ...
2. **Blocked by:** ...
3. **Impact:** ...
4. **Tried:** ...
5. **Ideal fix:** ...
**Owner (if known):** ...
**Escalation:** Leadership | Team | External

## Risks and early warnings
1. ...
2. ...

## Analyst notes for writer
- Leadership angle: ...
- Team angle: ...
- Data quality caveats: ...
```

## Output Example

# Analysis Brief — Goals Tracker

## Executive read (5 bullets max)
- Três de quatro metas semestrais permanecem verdes; eficiência máxima está âmbar por dependência arquitetural não resolvida.
- O gargalo INTS-645 afeta o épico de plataforma e empurra risco para a meta de eficiência no próximo sprint.
- Métricas de suporte e alertas seguem dentro da meta; nenhum sinal de degradação de SLA na semana.

## RAG legend (definitions used here)
- Green: progresso e evidências alinhados ao plano; sem bloqueio crítico não mitigado.
- Amber: risco material ou dependência não resolvida com prazo próximo.
- Red: meta fora do plano ou bloqueio crítico sem caminho acordado.

## Per-goal / theme status
| Theme / goal | RAG | Confidence | Evidence summary | Trend vs last period (if known) |
|--------------|-----|------------|------------------|--------------------------------|
| Gestão de alertas | 🟢 | High | SLA e volume dentro do esperado | Stable |
| Eficiência máxima | 🟡 | Med | Plataforma OK; edição travada por arquitetura | Worsening on "edição" |

## Blockers and dependencies (Five Whats)
### B1 — Edição de integração
1. **Doing:** Habilitar edição via plataforma (épico PLAT-100).
2. **Blocked by:** Decisão de arquitetura pendente (INTS-645).
3. **Impact:** Atraso de 1 sprint no roadmap do épico; risco para meta de eficiência.
4. **Tried:** Reuniões com arquitetura; proposta temporária recusada.
5. **Ideal fix:** Decisão documentada até sexta com opção escolhida.
**Owner (if known):** Tech lead PLAT
**Escalation:** Leadership

## Risks and early warnings
1. Divergência entre planilha (0% edição) e Jira (story em Review) pode distorcer a percepção de progresso — alinhar definição com PM.
2. Nenhum fim de SLA visível nesta semana; monitorar fila N8N se headcount mudar.

## Analyst notes for writer
- Leadership angle: enfatizar decisão arquitetural e custo de atraso no épico.
- Team angle: transparência sobre espera pela arquitetura e reconhecimento de entregas já feitas na plataforma.
- Data quality caveats: reconciliar PLAT-120 com coluna "edição" na planilha antes de narrar percentuais.

## Veto Conditions

Reject and redo if ANY of these are true:
1. RAG foi atribuído sem evidência citada do snapshot (issue, linha da planilha ou seção do research snapshot).
2. Algum bloqueio crítico listado não tem pelo menos três dos cinco elementos dos Five Whats preenchidos com dados ou marcados explicitamente como `Unknown`.

## Quality Criteria

- [ ] Cada meta ou tema principal tem RAG e uma linha de evidência rastreável ao snapshot.
- [ ] A legenda RAG está explícita e aplicada de forma consistente.
- [ ] Blockers usam Five Whats e indicam escalação sugerida (liderança/time/externo) quando aplicável.
- [ ] **Analyst notes for writer** dá ângulos distintos para relatório de liderança e de time.
