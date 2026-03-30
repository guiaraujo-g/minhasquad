---
execution: inline
agent: reviewer
inputFile: squads/goals-tracker/output/leadership-report.md
outputFile: squads/goals-tracker/output/review-notes.md
---

# Step 05: Revisão dos Relatórios (qualidade)

## Context Loading

Load these files before executing:
- `squads/goals-tracker/output/leadership-report.md` — Relatório de liderança (arquivo principal do `inputFile` deste passo).
- `squads/goals-tracker/output/leadership-report.html` — Layout canônico: `progressChart` + `frentes-table` + `w2h-table` (impedimentos); rejeitar se faltar frentes ou 5W2H, ou houver painel gestor / gráficos extras / A–E.
- `squads/goals-tracker/output/team-report.md` — Relatório de time (mesmo diretório versionado do run que o leadership report).
- `squads/goals-tracker/output/research-snapshot.md` — Verificação de fidelidade aos dados coletados.
- `squads/goals-tracker/output/analysis-brief.md` — Verificação de coerência com RAG e bloqueios analisados.
- `squads/goals-tracker/pipeline/data/quality-criteria.md` — Rubrica principal desta revisão.
- `squads/goals-tracker/pipeline/data/anti-patterns.md` — Lista de erros a flagar.

Se o checkpoint anterior registrou notas do usuário no chat, incorpore-as como contexto não obrigatório para priorizar feedback.

## Instructions

### Process
1. **Leitura dupla:** Avalie leadership e team contra `quality-criteria.md`, seção por seção relevante (liderança vs time).
1b. **Layout canônico (liderança):** Verificar `leadership-report.md` (ordem em `step-03-write.md`, tabela **frentes** + tabela **5W2H** em Impedimentos) e `leadership-report.html` (gráfico único + `frentes-table` + `w2h-table`). Sem Painel gestor / A–E. Violação → **REJECT** com must-fix.
2. **Checagem de dados:** Compare afirmações quantitativas e keys de issue com `research-snapshot.md` e com o `analysis-brief.md`; sinalize discrepâncias.
3. **Anti-patterns:** Marque jargão proibido, métricas de vaidade, tom inadequado ou reconhecimentos genéricos.
4. **Pontuação:** Atribua notas por dimensão e um veredito **APPROVE** ou **REJECT** (reject = exige correção no escritor antes de aprovação final humana).
5. **Salvar:** Escreva `review-notes.md` no formato obrigatório abaixo.

## Output Format

The output MUST follow this exact structure:
```markdown
# Review Notes — Goals Tracker

==============================
VERDICT: [APPROVE | REJECT]
==============================

## Scores (0–10)
| Dimension | Score | Comment |
|-----------|-------|---------|
| Leadership report — executive clarity | X/10 | ... |
| Leadership report — decision linkage | X/10 | ... |
| Team report — transparency & tone | X/10 | ... |
| Team report — recognition specificity | X/10 | ... |
| Data fidelity vs snapshot/brief | X/10 | ... |
| Anti-patterns avoided | X/10 | ... |

**Overall:** X/10

## Findings
### Must-fix (blocking)
- ...

### Should-fix (non-blocking)
- ...

## Path to approval (if REJECT)
1. ...
2. ...

## Sign-off for pipeline
- Ready for final human approval: [Yes | No]
```

## Output Example

# Review Notes — Goals Tracker

==============================
VERDICT: APPROVE
==============================

## Scores (0–10)
| Dimension | Score | Comment |
|-----------|-------|---------|
| Leadership report — executive clarity | 9/10 | Resumo e RAG legíveis em menos de um minuto. |
| Leadership report — decision linkage | 8/10 | Decisão de arquitetura bem amarrada ao risco. |
| Team report — transparency & tone | 9/10 | Honesto sobre bloqueio sem culpar indivíduos. |
| Team report — recognition specificity | 8/10 | Nomes e feitos presentes; poderia citar uma entrega a mais do snapshot. |
| Data fidelity vs snapshot/brief | 9/10 | Keys e prazos coerentes com o snapshot. |
| Anti-patterns avoided | 9/10 | Sem jargão vazio detectado. |

**Overall:** 8.8/10

## Findings
### Must-fix (blocking)
- Nenhum.

### Should-fix (non-blocking)
- No team report, explicitar o canal de feedback se o time usar mais de um fórum.

## Path to approval (if REJECT)
1. N/A

## Sign-off for pipeline
- Ready for final human approval: Yes

## Veto Conditions

Reject and redo if ANY of these are true:
1. O veredito é **APPROVE** apesar de haver must-fix de dados (número, key ou status) contraditórios ao `research-snapshot.md`.
2. O arquivo `review-notes.md` não contém tabela de scores e veredito explícito **APPROVE** ou **REJECT**.
3. O veredito é **APPROVE** enquanto `leadership-report.md` ou `leadership-report.html` viola o padrão fixo `2026-03-26-112700` / `step-03-write.md` (incluindo ausência da tabela de frentes ou da tabela **5W2H** nos impedimentos).

## Quality Criteria

- [ ] Ambos os relatórios foram considerados na avaliação (liderança e time).
- [ ] Layout canônico de liderança (.md + .html) verificado conforme `quality-criteria.md` e `step-03-write.md`.
- [ ] Critérios de `quality-criteria.md` foram aplicados de forma explícita nos comentários.
- [ ] **Data fidelity** foi verificada contra snapshot e brief.
- [ ] **Path to approval** está preenchido quando o veredito é **REJECT**.
