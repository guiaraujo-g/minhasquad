# jira-dash

Dashboard local de produtividade Jira com **Next.js 15 (App Router)** e **SSR**: o período vai na URL (`from`, `to` em `YYYY-MM-DD`); os dados são buscados **apenas no servidor** via REST API do Jira Cloud.

Ferramenta irmã do squad `squads/jira-productivity` (mesmo escopo de projetos e time em `_memory/memories.md`).

## Pré-requisitos

- Node.js 20+
- Instância **Jira Cloud** e token de API
- Campos JQL compatíveis (`project`, `created`, `resolved` ou `resolutiondate`, `sprint`, story points em `JIRA_STORY_POINTS_FIELD`)

## Configuração

```bash
cp .env.example .env.local
```

Preencha:

| Variável | Descrição |
|----------|-----------|
| `JIRA_BASE_URL` | URL base com `https://` (ex.: `https://empresa.atlassian.net`). Só o host também funciona (`empresa.atlassian.net` → `https://` é assumido) |
| `JIRA_EMAIL` | E-mail da conta Atlassian |
| `JIRA_API_TOKEN` | Token de API |
| `REPORT_DEFAULT_TIMEZONE` | Opcional; default do período quando `from`/`to` ausentes; também usado para **datas da sprint ativa** no atalho `?sprint=current` |
| `JIRA_ACTIVE_SPRINT_PROJECT` | Opcional: `IOAM` ou `INTS` — qual projeto consultar **primeiro** na API Agile para a sprint ativa (padrão: INTS, depois IOAM) |
| `JIRA_STORY_POINTS_FIELD` | Um ou mais IDs separados por vírgula (ordem de fallback), ex.: `customfield_10016` ou `customfield_10016,customfield_10037` |
| `JIRA_INTIOAM_SP_FIELDS` | Opcional: `navigable` para usar `*navigable` no `search/jql` em INTS+IOAM (quando SP não vem nos `customfield_*` explícitos) |
| `JIRA_TEAM_FILTER_MODE` | `displayName` (padrão, alinha ao squad) ou `accountId` |
| `JIRA_TEAM_ACCOUNT_IDS` | Obrigatório em modo `accountId`: IDs de conta separados por vírgula |
| `JIRA_JQL_RESOLVED_FIELD` | Opcional: `resolutiondate` se a instância não aceitar `resolved` nos filtros de intervalo |
| `JIRA_EXACT_ISSUE_COUNTS` | `true` para totais exatos (paginação; mais lento); padrão usa approximate-count |
| `JIRA_PROJECT_NE` | Chave do projeto N3; padrão `NE`. Se na sua instância for `N3`, defina `JIRA_PROJECT_NE=N3` |

### Escopo de assignees (time de 8 pessoas)

AL (criados/resolvidos), INTS+IOAM (resolvidos no período e sprint aberta) e a soma de SP na sprint atual usam o **mesmo** fragmento `assignee in (...)` que vem de `TEAM_DISPLAY_NAMES` quando `JIRA_TEAM_FILTER_MODE=displayName` (padrão), ou de `JIRA_TEAM_ACCOUNT_IDS` em modo `accountId`. O projeto N3 (`JIRA_PROJECT_NE`) já vinha filtrado assim quando o escopo N3 está ativo. Se estiver em `accountId` e `JIRA_TEAM_ACCOUNT_IDS` estiver vazio, não há filtro de assignee nessas JQLs (comportamento antigo para AL/INTS+IOAM).

Na **Visão Diretoria**, o card **Story Points concluídos no período · INTS+IOAM** é a soma de SP das issues resolvidas entre `from` e `to` com essa JQL — deve bater com a linha **Total** da tabela de distribuição de SP na Gestão.

### `resolved` vs `resolutiondate`

Nos exemplos do Goals Tracker (`squads/goals-tracker/pipeline/data/jira-queries.md`) o filtro de “resolvido no período” usa o campo **`resolved`**. Este app usa o mesmo por padrão (`JIRA_JQL_RESOLVED_FIELD` não definido). Se o Jira da empresa só interpretar **`resolutiondate`** na JQL, defina `JIRA_JQL_RESOLVED_FIELD=resolutiondate` e documente isso no time.

### Projeto N3 (`NE` vs `N3`)

O padrão é `NE`. Alguns documentos do repositório citam `N3`. **Não alteramos o default** para não quebrar quem já usa `NE`; se a chave real for `N3`, configure `JIRA_PROJECT_NE=N3`.

### Story Points (vários `customfield_*`)

O ID do campo de pontos **varia por instância** (e pode haver mais de um tipo de campo). No Jira, abra uma issue INTS/IOAM com pontos → **…** → exportar JSON e localize qual `customfield_*` traz o número. Use `JIRA_STORY_POINTS_FIELD` com um único ID ou **vários separados por vírgula**: o app usa o primeiro que tiver valor numérico na issue. No rodapé **JQL usada neste relatório** aparece a lista de IDs ativos.

Se a **distribuição INTS+IOAM** continuar com SP zerados mas existirem issues no período, defina `JIRA_INTIOAM_SP_FIELDS=navigable` para que a busca use `*navigable` (algumas instâncias não devolvem o custom field pedido por ID no `search/jql`).

## Rodar

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). Altere as datas no formulário e envie (GET) para recarregar o relatório.

O link **Sprint atual** (`?sprint=current`) lê `startDate`/`endDate` da API Agile e converte para **calendário** em `REPORT_DEFAULT_TIMEZONE` (não só a data UTC do prefixo ISO). Se a sprint do board que você usa for a do **IOAM**, defina `JIRA_ACTIVE_SPRINT_PROJECT=IOAM` para não pegar antes a sprint ativa só do INTS.

No rodapé, **“JQL usada neste relatório”** lista as consultas do run e os **campos de Story Points** usados (útil para comparar com `raw-metrics.md` do squad).

### Carregamento progressivo

Diretoria, Gestão e Histórico são buscadas em **blocos independentes** com `Suspense`: a página envia o shell (cabeçalho, datas, links) e cada seção aparece quando o respectivo conjunto de chamadas ao Jira termina. O número total de requests pode ser similar ao modo monolítico; o ganho é principalmente **tempo até ver o primeiro bloco** e percepção de progresso (skeletons). No mesmo request, `React.cache` deduplica **issues N3** e **issues INTS+IOAM resolvidas no período** entre Diretoria e Gestão.

## Build

```bash
npm run build
npm start
```

## Limites e notas

- **Intervalo máximo** entre `from` e `to`: 548 dias (~18 meses); acima disso a página retorna erro de validação.
- **API de busca**: Jira Cloud usa `POST /rest/api/3/search/jql`; o endpoint antigo `/rest/api/3/search` responde **410**.
- **Totais**: por padrão usa `POST /rest/api/3/search/approximate-count` (pode divergir de contagens “manuais” no squad). Com `JIRA_EXACT_ISSUE_COUNTS=true`, AL e N3 no período usam contagem exata paginando `search/jql` (mais chamadas à API, mais tempo; evite intervalos enormes).
- **SLA N3**: card na Diretoria — share de tickets resolvidos com ≤48h entre `created` e `resolutiondate`, meta 50% (referência Goals Tracker).
- **Rate limit**: paginação com `nextPageToken`.
- **Server vs Data Center**: o MVP assume API v3 de **Cloud**; campos customizados podem diferir.

## Checklist de aceite (paridade com o squad)

1. Escolha um `raw-metrics.md` (ou equivalente) de run recente do squad com JQL colada.
2. No dash, use o **mesmo** `from` / `to` e as **mesmas** variáveis de ambiente relevantes (`JIRA_PROJECT_*`, `JIRA_TEAM_FILTER_MODE`, `JIRA_JQL_RESOLVED_FIELD`, `JIRA_EXACT_ISSUE_COUNTS` se quiser bater totais exatos).
3. Abra **JQL usada neste relatório** e confira linha a linha com o que foi colado no relatório.
4. Compare: totais AL criados/resolvidos, N3 (time), SP INTS+IOAM no período; opcionalmente SLA N3 se a definição do squad for a mesma janela de 48h.

## Estrutura

- `app/page.tsx` — valida período e credenciais; `Suspense` + blocos async (Diretoria / Gestão / Histórico)
- `lib/jira/*` — cliente HTTP, busca paginada, JQL, `storyPoints.ts` (coerção de SP)
- `lib/report/sectionLoaders.ts` — fetch por seção; `cachedFetchers.ts` + `React.cache` para N3 e INTS+IOAM no período
- `lib/report/buildReport.ts` — agrega `loadFullReportData` (uso programático / testes)
- `components/ProductivityChart.tsx` — Chart.js (cliente)
