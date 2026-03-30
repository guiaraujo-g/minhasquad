---
execution: subagent
agent: researcher
inputFile: squads/goals-tracker/output/run-scope.md
outputFile: squads/goals-tracker/output/research-snapshot.md
model_tier: fast
---

# Step 01: Pesquisa de Dados (Jira + Google Sheets)

## Context Loading

Load these files before executing:
- **`squads/goals-tracker/pipeline/data/squad-goals.md` — OBRIGATÓRIO.** Metas do semestre, pesos, links Jira/planilha e time. Toda coleta deve cobrir **cada linha** desse arquivo ou documentar lacuna em **Data gaps** (não ignorar silenciosamente).
- **`squads/goals-tracker/pipeline/data/jira-queries.md` — OBRIGATÓRIO para Alertas; referência para N3.** JQL e método para **SLA Urgente/Alta &lt; 2 dias**: a cada run, executar a busca no Jira (MCP `search_jira` com `fields` incluindo `created` e, se disponível, `resolutiondate`) e registrar no snapshot: **N** issues, **share ≤48h**, **alvo 50%**, JQL exata, e se usou proxy `updated`. Para **SLA N3 &lt; 48h** (`squad-goals.md`), o parâmetro é `project IN (N3)` **e** `assignee IN (...)` exclusivo (oito nomes) em `jira-queries.md`; calcular share com **created → resolutiondate** ≤48h (obrigar `resolutiondate` nos fields; proxy `updated` só documentado se necessário). Para **tickets/integração &lt; 1,6**, tratar à parte: numerador N3 escopo integração + denominador fluxos integrados — **sem** usar o filtro assignee do SLA como definição dessa razão.
- `squads/goals-tracker/_memory/memories.md` — Aprendizados e pendências (ex.: épico de edição ainda não chaveado).
- `squads/goals-tracker/output/run-scope.md` — Escopo do run (período, filtros Jira, planilha/abas Google Sheets). Se não existir no diretório deste run, derive a partir de **`squad-goals.md` + `memories.md`** + `_opensquad/_memory/company.md` + mensagem do usuário; inclua **URL/ID da planilha** e JQLs dos projetos listados em `squad-goals.md`; em seguida registre o resumo em `run-scope.md` antes de qualquer busca.
- `squads/goals-tracker/pipeline/data/research-brief.md` — Referência de vocabulário e boas práticas de reporting executivo e de metas.
- `squads/goals-tracker/pipeline/data/domain-framework.md` — Framework de ingestão, normalização e o que extrair de cada fonte.
- `squads/goals-tracker/pipeline/data/anti-patterns.md` — Erros a evitar na coleta.

Siga as skills **jira** e **google-sheets** do agente para consultar fontes conforme o escopo.

## Instructions

### Process
1. **Confirmar escopo:** Leia `squad-goals.md` primeiro; alinhe `run-scope.md` aos projetos/épicos/planilha ali listados. Liste Jira (Alertas Integração, N3, INTS-645/659/643/662/587, etc.), datas, fuso e planilha (ID/URL, abas, ranges). Documente suposições e riscos no snapshot. **Período padrão:** se o usuário não fixar intervalo, usar o **mês civil atual** (do dia 1 ao último dia do mês na timezone do escopo, p.ex. America/Sao_Paulo) e registrar em `run-scope.md` e em **Run scope (frozen)** — consultas devem permitir reportar progresso **por meta definida em `squad-goals.md`**.
2. **Coletar no Jira:** Para **cada** meta com fonte Jira em `squad-goals.md`, busque evidências (board, épico, projeto N3, etc.); status, bloqueios, dependências; registre JQL/board/filtros reprodutíveis. **Obrigatório:** para **Alertas — SLA &lt; 2 dias (Urgente/Alta)**, rodar a JQL em `jira-queries.md` no período do run (via `search_jira`), calcular % com resolução em ≤48h (preferir `resolutiondate`; se o MCP só devolver `created`/`updated`, usar proxy conforme `jira-queries.md` e declarar no snapshot). Para **SLA N3 &lt; 48h**, usar a JQL da seção N3 de `jira-queries.md` (**project + assignee IN fixo** + resolvidos no período); se o MCP não aplicar assignee/`resolutiondate`, preferir `search_jira` com a JQL documentada ou registrar lacuna. Para **tickets/integração**, registrar JQL de escopo integração e denominador conforme PO — métrica independente do assignee list do SLA.
3. **Coletar no Google Sheets:** Abas acordadas; valores, metas, pesos, owners, timestamps; cite aba/range/coluna por métrica.
4. **Normalizar e cruzar:** Alinhe nomes de metas entre Jira e planilha; quando houver divergência numérica ou de status, registre ambas as leituras e marque inconsistência. Não atribua RAG — apenas fatos e referências.
5. **Escrever o snapshot:** Preencha `research-snapshot.md` com o formato obrigatório abaixo, datado com horário de corte e limitações explícitas.

## Output Format

The output MUST follow this exact structure:
```markdown
# Research Snapshot — Goals Tracker

## Run scope (frozen)
- Period: [timezone-aware range]
- Jira scope: [projects/boards/epics/JQL summary]
- Google Sheets: [spreadsheet id or name, tabs, cell/table ranges]
- Cutoff timestamp: [ISO-8601]

## Sources and queries (reproducibility)
### Jira
- [Query/view/board and purpose]

### Google Sheets
- [Tab, range, what was read]

## Summary by source
### Jira — headline facts
- ...

### Google Sheets — headline facts
- ...

## Goals / work items (normalized table)
| Goal / theme | Source row or epic key | Jira key(s) | Raw status / value | Blocker or dependency | Last update |
|--------------|------------------------|-------------|--------------------|-----------------------|-------------|
| ... | ... | ... | ... | ... | ... |

## Cross-checks and inconsistencies
- [None | list each mismatch with both sources]

## Data gaps and collection errors
- [None | API error, empty tab, permission issue, etc.]

## Appendix — reference keys
- Issues: [KEY-1, KEY-2, ...]
```

## Output Example

# Research Snapshot — Goals Tracker

## Run scope (frozen)
- Period: 2026-03-17 to 2026-03-23 (America/Sao_Paulo)
- Jira scope: Project PLAT, board Delivery, epics PLAT-100, PLAT-112
- Google Sheets: file `Metas-2026`, tabs `Semestre`, `Health`
- Cutoff timestamp: 2026-03-23T18:00:00-03:00

## Sources and queries (reproducibility)
### Jira
- Board Delivery — columns In Progress / Blocked / Done; filter epic in (PLAT-100, PLAT-112)

### Google Sheets
- Tab `Semestre` — columns A:F rows 2:40; Tab `Health` — KPI block B2:D10

## Summary by source
### Jira — headline facts
- PLAT-100 In Progress; linked blocker INTS-645 (Waiting on architecture).
- PLAT-112 Done this week; no open subtasks.

### Google Sheets — headline facts
- Meta "Eficiência máxima" 20% plataforma / 0% edição (coluna "Entregas").

## Goals / work items (normalized table)
| Goal / theme | Source row or epic key | Jira key(s) | Raw status / value | Blocker or dependency | Last update |
|--------------|------------------------|-------------|--------------------|-----------------------|-------------|
| Eficiência máxima | Row 4 Semestre | PLAT-100 | In Progress | INTS-645 architecture | 2026-03-22 |
| Suporte integrado | Row 6 Semestre | PLAT-88 | SLA < 48h maintained | — | 2026-03-21 |

## Cross-checks and inconsistencies
- Planilha "Edição 0%" vs Jira PLAT-120 em Review — alinhar definição na planilha.

## Data gaps and collection errors
- Nenhum.

## Appendix — reference keys
- Issues: PLAT-100, PLAT-112, PLAT-88, PLAT-120, INTS-645

## Veto Conditions

Reject and redo if ANY of these are true:
1. O snapshot não cita origem reprodutível (Jira ou planilha) para cada linha da tabela principal de metas/work items.
2. Houve coleta parcial por erro de API/permissão e o arquivo não contém a seção **Data gaps and collection errors** explicando o impacto.

## Quality Criteria

- [ ] Jira e Google Sheets consultados ou lacuna em **Data gaps**.
- [ ] Tabelas com chaves de issue ou referência de linha/aba.
- [ ] Sem RAG ou narrativa executiva; corte e fuso em **Run scope**.
