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
| `REPORT_DEFAULT_TIMEZONE` | Opcional; default do período quando `from`/`to` ausentes |
| `JIRA_STORY_POINTS_FIELD` | ID do custom field de pontos (ex.: `customfield_10016`) |
| `JIRA_TEAM_FILTER_MODE` | `displayName` (padrão, alinha ao squad) ou `accountId` |
| `JIRA_TEAM_ACCOUNT_IDS` | Obrigatório em modo `accountId`: IDs de conta separados por vírgula |
| `JIRA_JQL_RESOLVED_FIELD` | Opcional: `resolutiondate` se a instância não aceitar `resolved` nos filtros de intervalo |
| `JIRA_EXACT_ISSUE_COUNTS` | `true` para totais exatos (paginação; mais lento); padrão usa approximate-count |
| `JIRA_PROJECT_NE` | Chave do projeto N3; padrão `NE`. Se na sua instância for `N3`, defina `JIRA_PROJECT_NE=N3` |

### `resolved` vs `resolutiondate`

Nos exemplos do Goals Tracker (`squads/goals-tracker/pipeline/data/jira-queries.md`) o filtro de “resolvido no período” usa o campo **`resolved`**. Este app usa o mesmo por padrão (`JIRA_JQL_RESOLVED_FIELD` não definido). Se o Jira da empresa só interpretar **`resolutiondate`** na JQL, defina `JIRA_JQL_RESOLVED_FIELD=resolutiondate` e documente isso no time.

### Projeto N3 (`NE` vs `N3`)

O padrão é `NE`. Alguns documentos do repositório citam `N3`. **Não alteramos o default** para não quebrar quem já usa `NE`; se a chave real for `N3`, configure `JIRA_PROJECT_NE=N3`.

## Rodar

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). Altere as datas no formulário e envie (GET) para recarregar o relatório.

No rodapé da página, **“JQL usada neste relatório”** lista as consultas exatas do run (útil para comparar com `raw-metrics.md` do squad).

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

- `app/page.tsx` — lê `searchParams`, chama `buildReport`
- `lib/jira/*` — cliente HTTP, busca paginada, JQL
- `lib/report/buildReport.ts` — agregações e DTO para a UI
- `components/ProductivityChart.tsx` — Chart.js (cliente)
