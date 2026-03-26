---
execution: inline
agent: reviewer
inputFile: squads/jira-productivity/output/final-reports.md
outputFile: squads/jira-productivity/output/review-verdict.md
---

# Step 04: Revisão de Qualidade

## Context Loading

Load these files before executing:
- `squads/jira-productivity/output/final-reports.md` — Os 3 relatórios gerados
- `squads/jira-productivity/pipeline/data/quality-criteria.md` — Critérios de qualidade
- `squads/jira-productivity/pipeline/data/anti-patterns.md` — Anti-patterns a verificar

## Instructions

### Process
1. Leia os 3 relatórios gerados pelo Tiago Texto.
2. Avalie cada relatório contra os critérios de qualidade definidos em `quality-criteria.md`.
3. Verifique se nenhum dos anti-patterns foi cometido (ex: uso de Story Points como produtividade, jargões na visão diretoria).
4. Gere o veredito final (APPROVE ou REJECT) com justificativas e sugestões de melhoria.

## Output Format

The output MUST follow this exact structure:
```markdown
==============================
 REVIEW VERDICT: [APPROVE ou REJECT]
==============================

------------------------------
 SCORING TABLE
------------------------------
| Criterion              | Score  | Summary                                         |
|------------------------|--------|-------------------------------------------------|
| Visão Diretoria        | [X]/10 | [Resumo]                                        |
| Visão Gestão           | [X]/10 | [Resumo]                                        |
| Visão Time             | [X]/10 | [Resumo]                                        |
| Ausência de Anti-patterns| [X]/10 | [Resumo]                                      |

OVERALL: [X]/10

DETAILED FEEDBACK:
[Required change: ...] (se REJECT)
[Strength: ...]
[Suggestion (non-blocking): ...]

PATH TO APPROVAL (se REJECT):
1. [Passo 1]
2. [Passo 2]
```

## Output Example

==============================
 REVIEW VERDICT: APPROVE
==============================

------------------------------
 SCORING TABLE
------------------------------
| Criterion              | Score  | Summary                                         |
|------------------------|--------|-------------------------------------------------|
| Visão Diretoria        | 9/10   | Sem jargões, foco em risco e impacto.           |
| Visão Gestão           | 8/10   | Gargalo bem identificado, ação clara.           |
| Visão Time             | 9/10   | Tom empático, focado em melhoria contínua.      |
| Ausência de Anti-patterns| 10/10| Nenhum anti-pattern detectado.                  |

OVERALL: 9.0/10

DETAILED FEEDBACK:
Strength: A tradução do gargalo de Code Review para "risco de estabilidade" na Visão Diretoria foi excelente.
Suggestion (non-blocking): Na Visão Time, a sugestão de combinado poderia ser um pouco mais específica, definindo quem vai monitorar o WIP limit.

## Veto Conditions

Reject and redo if ANY of these are true:
1. O review aprova um texto que contém jargões na Visão Diretoria.
2. O review não fornece justificativa para notas abaixo de 10.

## Quality Criteria

- [ ] O veredito é claro (APPROVE ou REJECT).
- [ ] O feedback detalhado aponta exatamente onde está o problema.