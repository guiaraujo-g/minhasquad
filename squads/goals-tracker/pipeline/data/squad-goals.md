# Metas canônicas — Goals Tracker

> **Fonte:** definição informada na criação do squad.  
> **Semestre de acompanhamento:** janeiro/2026 a julho/2026 (America/Sao_Paulo).  
> **Relatórios:** liderança (impedimentos, big numbers) + time (transparência, engajamento).

Use este arquivo como **checklist obrigatório** em todo run: cada meta abaixo deve aparecer no `research-snapshot` (linha ou lacuna explícita), no `analysis-brief` (RAG por tema) e nos relatórios de liderança/time — salvo impossibilidade técnica documentada em **Data gaps**.

---

## 1. Gestão de alertas — meta agregada **100%**

| Peso | Critério | Fonte | Como acompanhar |
|------|----------|--------|-----------------|
| **50%** | Tempo de resolução de alertas **Urgentes/Alta** (N8N) **&lt; 2 dias** | Jira | `project = "Alertas Integração"` (board/projeto de alertas) |
| **50%** | Saúde das integrações = **100%** | Google Sheets | Planilha: `https://docs.google.com/spreadsheets/d/1lggk00rk1NYB53xPTOcI3twUEcXWn2eu4pOhQck3rQ0/edit?usp=sharing` — registrar abas/ranges no `run-scope` quando possível |

---

## 2. Eficiência máxima — **zero pendências** em integrações essenciais para clientes

| Peso | Critério | Fonte | Como acompanhar |
|------|----------|--------|-----------------|
| **20%** | Habilitar plataforma para providers: RM Totvs, ADP API, ADP XML, Sênior, Metadados, LG Nuvem | Jira | Épico: [INTS-645](https://gupy-io.atlassian.net/browse/INTS-645) |
| **20%** | Habilitar **edição de integração** via plataforma | Jira | Épico: **não informado na criação** — preencher em `memories.md` ou aqui quando houver chave; até lá, citar lacuna no snapshot |
| **40%** | Habilitar via plataforma **exame médico (SOC)** **ou** **criação de vagas** | Jira | SOC: [INTS-659](https://gupy-io.atlassian.net/browse/INTS-659) · Criação de vagas: [INTS-643](https://gupy-io.atlassian.net/browse/INTS-643) |
| **20%** | Habilitar **workflows customizados** | Jira | [INTS-662](https://gupy-io.atlassian.net/browse/INTS-662) |

---

## 3. Suporte ao cliente integrado — meta agregada **100%**

| Peso | Critério | Fonte | Como acompanhar |
|------|----------|--------|-----------------|
| **50%** | Tickets/integração **&lt; 1,6** (N3 ÷ fluxos integrados) | Jira | Quantidade tickets N3 vs fluxos integrados |
| **50%** | SLA de tickets **&lt; 48h** | Jira | `project IN (N3)` (ajustar JQL conforme naming real do projeto) |

---

## 4. Produtividade do time de desenvolvimento

| Critério | Fonte | Como acompanhar |
|----------|--------|-----------------|
| **90%** cobertura **Workflows autogerados** (90% das tarefas tipo “Novo desenvolvimento” pontuadas em 1) | Jira | Primeira atividade citada: [INTS-587](https://gupy-io.atlassian.net/browse/INTS-587) |
| **30 pontos por sprint** (produtividade dev) | Jira | Por sprint, **individual por colaborador** |

---

## Colaboradores do time (referência para reconhecimentos / filtros)

- Adriel Henrique Borges Cochito  
- Antonio Balardino  
- Bruna Elis Vogel  
- Daniel Cruz  
- Wellington Casas  
- Pedro Bittencourt  
- Jonas Elan  
- Maria Eduarda da Silva Joaquim  

---

## IDs úteis

- **Spreadsheet ID (saúde integrações):** `1lggk00rk1NYB53xPTOcI3twUEcXWn2eu4pOhQck3rQ0`
