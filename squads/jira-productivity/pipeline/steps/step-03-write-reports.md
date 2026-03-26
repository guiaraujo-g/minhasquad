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

## Instructions

### Process
1. Leia os dados brutos e insights gerados pelo Daniel Dados.
2. Escreva a **Visão Diretoria (Executiva)**: foque em impacto de negócio, riscos, SLAs e previsibilidade. Evite jargões técnicos. Máximo de 5 linhas para o resumo.
3. Escreva a **Visão Gestão**: foque em eficiência do fluxo, gargalos, WIP e qualidade. Inclua recomendações de ajuste de processo.
4. Escreva a **Visão Time (Retrospectiva)**: foque em empatia, celebração de vitórias, identificação de dores (outliers) e combinados práticos para a próxima sprint.

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

## Quality Criteria

- [ ] O Resumo Executivo tem no máximo 5 linhas.
- [ ] Cada visão tem um tom de voz adequado ao seu público.
- [ ] Todas as 3 visões apresentam ações/recomendações claras.