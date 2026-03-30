# jira-dash

Dashboard local de produtividade Jira com **Next.js 15 (App Router)** e **SSR**: o período vai na URL (`from`, `to` em `YYYY-MM-DD`); os dados são buscados **apenas no servidor** via REST API do Jira Cloud.

Ferramenta irmã do squad `squads/jira-productivity` (mesmo escopo de projetos e time em `_memory/memories.md`).

## Pré-requisitos

- Node.js 20+
- Instância **Jira Cloud** e token de API
- Campos JQL compatíveis (`project`, `created`, `resolutiondate`, `sprint`, story points em `JIRA_STORY_POINTS_FIELD`)

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
| `REPORT_DEFAULT_TIMEZONE` | Opcional; default do período quando `from`/`to` ausentes |
| `JIRA_STORY_POINTS_FIELD` | ID do custom field de pontos (ex.: `customfield_10016`) |
| `JIRA_TEAM_ACCOUNT_IDS` | IDs de conta (vírgula) para filtrar N3 resolvido “pelo time” |

Sem `JIRA_TEAM_ACCOUNT_IDS`, os totais **AL** (criados/resolvidos) e **INTS+IOAM** (SP concluídos no período) ainda funcionam; métricas que dependem do filtro explícito de assignees do time mostram aviso.

## Rodar

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). Altere as datas no formulário e envie (GET) para recarregar o relatório.

## Build

```bash
npm run build
npm start
```

## Limites e notas

- **Intervalo máximo** entre `from` e `to`: 548 dias (~18 meses); acima disso a página retorna erro de validação.
- **API de busca**: Jira Cloud usa `POST /rest/api/3/search/jql`; o endpoint antigo `/rest/api/3/search` responde **410**. Totais usam `POST /rest/api/3/search/approximate-count` (contagem aproximada da plataforma).
- **Rate limit**: paginação com `nextPageToken`.
- **Server vs Data Center**: o MVP assume API v3 de **Cloud**; campos customizados podem diferir.

## Estrutura

- `app/page.tsx` — lê `searchParams`, chama `buildReport`
- `lib/jira/*` — cliente HTTP, busca paginada, JQL
- `lib/report/buildReport.ts` — agregações e DTO para a UI
- `components/ProductivityChart.tsx` — Chart.js (cliente)
