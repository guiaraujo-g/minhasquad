# Output Examples: Executive Reporting & Goal Tracking

> **Estrutura obrigatória do relatório de liderança:** em todo run, o `.md` e o `.html` devem seguir `2026-03-26-112700/v1/leadership-report.*` — incluindo **`## Andamento por frente (explícito)`** com tabela por frente de `squad-goals.md`. Ver `pipeline/steps/step-03-write.md`. Sem painel gestor nem seções A–E.

## Example 1: Leadership Report (markdown — headings exatos)

```markdown
# Relatório de Liderança — Goals Tracker

## Resumo executivo (1 frase + 2–4 bullets)
**Frase:** …
- …
- …

## Status das metas (RAG)
- **Gestão de alertas:** …
- **Eficiência máxima:** …
- **Suporte integrado:** …
- **Produtividade:** …

## Andamento por frente (explícito)

| Frente | Peso / meta | Rastreio | Andamento no período |
|--------|-------------|----------|----------------------|
| … | … | … | … |

## Impedimentos e decisões (Five Whats e 5W2H)

| # | O quê | Por quê | Onde | Quando | Quem | Como | Quanto |
|---|-------|---------|------|--------|------|------|--------|
| 1 | … | … | … | … | … | … | … |

## Próximos passos recomendados (liderança)
1. …
2. …
```

## Example 2: Team Report

**Foco da Semana:**
Esta semana, nosso foco principal foi avançar na meta de Eficiência Máxima, especificamente habilitando a plataforma de integração para os providers RM Totvs e ADP API.

**O que entregamos:**
- Lançamos a primeira versão da plataforma para RM Totvs (INTS-645).
- Reduzimos o tempo médio de resolução de alertas N8N para 1.5 dias!

**Onde estamos travados:**
- Estamos aguardando uma definição de arquitetura para podermos avançar na funcionalidade de edição de integração. O time de arquitetura está revisando nossa proposta e esperamos uma resposta até sexta.

**Decisões tomadas:**
- Decidimos priorizar a integração com a ADP API antes da Sênior, pois o impacto no cliente final é maior no curto prazo.

**Reconhecimentos:**
- **Adriel e Bruna:** Excelente trabalho na refatoração do código da plataforma, o que permitiu a entrega antecipada da integração RM Totvs!
- **Jonas:** Obrigado por assumir a liderança na resolução dos alertas urgentes esta semana, garantindo nossa meta de SLA.

**Como se envolver:**
- Se você tem ideias sobre a arquitetura de edição, por favor, deixe seus comentários na issue do Jira ou participe do nosso sync técnico na quinta-feira.
