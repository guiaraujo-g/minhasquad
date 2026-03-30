# Squad Memories

Este arquivo armazena aprendizados, preferências do usuário e histórico de execuções do squad.

## Aprendizados
- **Sempre criar o HTML:** Em qualquer run ou pedido de relatório deste squad, a entrega **não** pode ficar só em markdown — é **obrigatório** gerar `dashboard-final.html` (regras detalhadas nos itens seguintes e no step 03).
- **Escopo de projetos (usuário):** Em todas as pesquisas solicitadas pelo usuário, buscar sempre em: **INTS**, **IOAM**, **Alertas Integração** (projeto Jira `Alertas Integração`, chave de issue **AL**), **N3** (projeto Jira **N3**, chave de issue **NE**). Ajustar JQL e ferramentas conforme esses escopos.
- **Membros do Time:** Em TODAS as buscas, extrações e análises, considere SEMPRE e EXCLUSIVAMENTE os seguintes responsáveis: "Adriel Henrique Borges Cochito", "Antonio Balardino", "Bruna Elis Vogel", "Daniel Cruz", "Wellington Casas", "Pedro Bittencourt", "Jonas Elan", "Maria Eduarda da Silva Joaquim".
- O usuário prefere visualizações ricas (HTML/Dashboards) em vez de apenas texto markdown para a aprovação final e compartilhamento.
- **Dashboard HTML obrigatório:** Em todo run, o passo de escrita (writer / step 03) deve **sempre** gerar `dashboard-final.html` no mesmo diretório versionado que `final-reports.md` (`…/output/{run_id}/vN/`). O revisor deve **REJECT** se o arquivo faltar. Layout de referência versionado: `pipeline/data/dashboard-layout-reference.html`.
- **Novo relatório = HTML com estrutura atual:** Sempre que o usuário pedir um **novo relatório** (run do pipeline, rerun, ou relatório pontual), a entrega deve incluir **`dashboard-final.html`** alinhado à **estrutura atual de reporte** definida em `pipeline/data/dashboard-layout-reference.html` do repositório — **não** usar como modelo estrutural um HTML antigo de pastas `output/` de runs passados; copiar seções, CSS, scripts e IDs a partir do reference atualizado e só então preencher dados do período.
- **Conteúdo fixo do HTML:** (1) Diretoria: cards — SP alocados na sprint INTS+IOAM; N3 resolvidos **só pelo time**; total alertas criados; total alertas resolvidos. (2) Gestão: gráfico Chart.js **produtividade vs meta 30 SP/pessoa**. (3) Histórico: pivots com **no máximo 7 colunas de mês** + filtro de período (≤7 meses). Analista deve expor no `raw-metrics.md` os campos necessários.
- A métrica de Story Points está sendo usada como medida de carga/capacidade, e não de produtividade (velocity).
- O projeto de alertas tem um volume alto de itens na categoria "[Média][API Cliente]" (Porto).

## Histórico de Execuções
- **2026-03-30**: Parâmetros salvos (INTS, IOAM, AL, N3; sprint atual). Dados extraídos via MCP (HTML consolidado ausente no repo). Run `2026-03-30-121618`: `v1/raw-metrics.md`, `v1/final-reports.md`, `v1/review-verdict.md` (revisão APPROVE ~8,8/10). Checkpoint final pendente de confirmação do usuário.
- **2026-03-26**: Execução bem-sucedida. Analisados os últimos 14 dias. Gerado dashboard HTML com as 3 visões (Diretoria, Gestão, Time).