# Jira — consultas reprodutíveis (Goals Tracker)

> **Regra:** para métricas de **Alertas Integração**, **sempre** buscar no Jira a cada run (MCP `search_jira` ou equivalente). Não marcar SLA como “não medido” sem executar a JQL abaixo ou variante com o período do `run-scope.md`.

## Assignees (meta gestão de alertas — filtro equipe)

Mesmo conjunto usado em `buscar_alertas_resolvidos` no MCP:

`Adriel Henrique Borges Cochito`, `Daniel Cruz`, `Wellington Casas`, `Pedro Bittencourt`, `Bruna Elis Vogel`, `Maria Eduarda da Silva Joaquim`, `Guilherme A Garcia`

## Assignees (N3 — filtro **exclusivo** para **SLA tickets &lt; 48h**)

A lista abaixo vale **somente** para a métrica **SLA de tickets &lt; 48h** (50% da meta “Suporte ao cliente integrado”). **Não** se aplica à métrica **tickets/integração &lt; 1,6**, que é uma razão com numerador (escopo integração a acordar com PO) e denominador (fluxos integrados) — ver nota no fim desta seção N3.

`Adriel Henrique Borges Cochito`, `Antonio Balardino`, `Bruna Elis Vogel`, `Daniel Cruz`, `Wellington Casas`, `Pedro Bittencourt`, `Jonas Elan`, `Maria Eduarda da Silva Joaquim`

*(Alinhado à seção **Colaboradores do time** em `squad-goals.md`.)*

## SLA — alertas Urgente/Alta resolvidos em &lt; 2 dias (50% da meta)

**Projeto:** `Alertas Integração`  
**Proxy de prioridade N8N no título:** `summary ~ "Urgente" OR summary ~ "[Alta]"` (alinhar com operação se o padrão de título mudar).

### JQL base (ajustar datas ao período do run)

```jql
project = "Alertas Integração"
AND resolved >= "YYYY-MM-DD"
AND resolved <= "YYYY-MM-DD"
AND assignee IN ("Adriel Henrique Borges Cochito", "Daniel Cruz", "Wellington Casas", "Pedro Bittencourt", "Bruna Elis Vogel", "Maria Eduarda da Silva Joaquim", "Guilherme A Garcia")
AND (summary ~ "Urgente" OR summary ~ "[Alta]")
ORDER BY resolved DESC
```

### Campos solicitados na API / `search_jira`

- Obrigatórios: `summary`, `status`, `assignee`, `created`, `resolutiondate` (ou `updated` se `resolutiondate` não vier no payload normalizado do MCP).

### Cálculo no consolidado

1. Para cada issue **resolvida** no período que caia no filtro acima:
   - **Ideal:** horas entre `created` e **`resolutiondate`**.
   - **Enquanto o MCP não expuser `resolutiondate` no objeto parseado:** usar **`updated`** como *proxy* da última movimentação (pode superestimar tempo se houver edição pós-resolução — documentar no relatório).
2. Contar share **≤ 48h** (dias calendário/horas reais entre os timestamps).
3. Se `maxResults` for 100 e a busca retornar 100 issues, **assumir possível truncamento** e paginar (`startAt`) ou citar “primeiros N por ordenação”.

### Alvo formal

50% das resoluções Urgente/Alta em **menos de 2 dias** (`squad-goals.md`). Comparar o share calculado com **50%** e classificar no painel gestor (**Abaixo da meta** / **Dentro da meta** conforme o número).

---

## N3 — SLA de tickets **&lt; 48h** (50% da meta “Suporte ao cliente integrado”)

**Parâmetro canônico:** demanda do **board/projeto N3** no Jira — `project IN (N3)` (ajustar o key se o naming real do projeto for outro) **e** `assignee IN (...)` com a lista fixa da seção **Assignees (N3 — filtro exclusivo para SLA)** acima. O consolidado deve ancorar **esta** métrica de SLA **nessa** base (projeto + responsáveis), não em outro recorte.

**Definição de tempo (SLA):** para cada issue **resolvida** no período, medir o intervalo entre **`created`** e **`resolutiondate`**. Considerar **dentro da meta** quando esse intervalo for **≤ 48 horas**. *(Operacionalmente “≤ 2 dias” só coincide com 48h se a regra de negócio for explícita — ex.: dias corridos vs horas úteis; registrar no snapshot.)*

### JQL base (ajustar datas ao período do run)

```jql
project IN (N3)
AND resolved >= "YYYY-MM-DD"
AND resolved <= "YYYY-MM-DD"
AND assignee IN ("Adriel Henrique Borges Cochito", "Antonio Balardino", "Bruna Elis Vogel", "Daniel Cruz", "Wellington Casas", "Pedro Bittencourt", "Jonas Elan", "Maria Eduarda da Silva Joaquim")
ORDER BY resolved DESC
```

### Campos e cálculo

- **Obrigatório** pedir **`created`** e **`resolutiondate`** em `search_jira` / API. O cálculo do SLA N3 deve usar **`resolutiondate`** quando o campo existir no payload.
- **`updated`** como proxy **só** se `resolutiondate` estiver **indisponível** no MCP — declarar explicitamente no snapshot/relatório (evitar tratar N3 SLA como os alertas, onde o proxy é mais frequente).
- Contar o **share** de issues com Δ(created→resolutiondate) **≤ 48h** no conjunto resolvido no período; comparar com o alvo formal em `squad-goals.md`.
- Se `maxResults` for 100 e a busca retornar 100 issues, paginar (`startAt`) ou citar “primeiros N”.

### MCP

Para **SLA N3 &lt; 48h**, quando o run usar **`buscar_tickets_n3`** (ou equivalente), a JQL embutida deve equivaler à de cima (**incluindo** o `assignee IN` exclusivo desta seção).

### Tickets/integração (&lt; 1,6) — **métrica separada**

Indicador **independente** do SLA: **tickets N3 no escopo “integração”** (filtro Jira a acordar com PO: label, componente, épico, etc.) **÷ número de fluxos integrados** (denominador a acordar). **Não** usar a lista de assignees do SLA como definição desta meta; documentar numerador e denominador no snapshot antes de reportar.
